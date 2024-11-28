import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of, BehaviorSubject, Observable } from 'rxjs';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { ServicesService } from '../../services/services.service';
import { ServiceModel } from '../../models/service.model';
import { Response } from 'src/app/shared/models/reponse';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, PipeModule],
})
export class ServiceFormComponent implements OnInit {
  form: FormGroup;
  services: ServiceModel[] = [];
  searchDriver$ = new BehaviorSubject<string>('');
  drivers$: Observable<any>;
  loading: boolean = false;
  constructor(
    private driverService: DriversService,
    private serviceApi: ServicesService,
    private drawerRef: NzDrawerRef,
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.drivers$ = this.searchDriver$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.driverService.getAll({}, searchTerm).pipe(
        catchError((err) => {
          return of({ data: { content: [] } });
        })
      )),
    );
    this.getServices();
  }

  findDriver(ev: string) {
    let searchAs = this.form.get('searchAs')?.value;

    let filter = generateQueryFilter({ [searchAs]: ev });
    this.searchDriver$.next(filter);
  }
  getServices() {
    this.serviceApi.getServiceList().subscribe((res: Response<ServiceModel[]>) => {
      if (res) {
        this.services = res.data;
      }
    });
  }
  initForm() {
    this.form = new FormGroup({
      driverId: new FormControl(null, [Validators.required]),
      serviceIds: new FormControl([null], [Validators.required]),
      searchAs: new FormControl('driverId'),
    });
  }
  onCancel() {
    this.drawerRef.close({success: false});
  }
  onSubmit() {

  }
}
