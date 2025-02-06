import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { TransportsService } from '../../services/transports.service';
import { ActivatedRoute } from '@angular/router';
import { PageParams } from 'src/app/pages/orders/models/page-params.interface';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { catchError, finalize, tap } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-transport-history',
  templateUrl: './transport-history.component.html',
  styleUrls: ['./transport-history.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule]
})
export class TransportHistoryComponent implements OnInit{
  @Input() transportId: string | number;
  data
  loading = false;
  totalItemsCount
  pageParams: PageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: '',
    sortType: '',
  };
  constructor(
    private transportService: TransportsService,
    private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
      this.getHistory();
  }

  getHistory() {
     this.loading = true;
    const params = {
      pageIndex: this.pageParams.pageIndex,
      pageSize: this.pageParams.pageSize,
      sortBy: this.pageParams.sortBy,
      sortType: this.pageParams.sortType,
      transportId : this.router.snapshot.params['id']
    };
    let query = generateQueryFilter(params)
    this.transportService
      .getTransportHistory(query)
      .pipe(
        tap((res: any) => {
          if (res && res?.success) {
            this.data = res.data.content;
            this.pageParams.totalPagesCount = res.data.totalPagesCount;
            this.totalItemsCount = this.pageParams.pageSize * this.pageParams.totalPagesCount;
          }
          else {
            this.data = [];
          }
        }),
        tap(() => (this.loading = false)),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }
  public onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageParams.pageIndex = params.pageIndex;
    this.pageParams.pageSize = params.pageSize;
    let { sort } = params;
    let currentSort = sort.find((item) => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;
    sortOrder === 'ascend'
      ? (sortOrder = 'asc')
      : sortOrder === 'descend'
        ? (sortOrder = 'desc')
        : (sortOrder = '');
    this.pageParams.sortBy = sortField;
    this.pageParams.sortType = sortOrder;
    this.getHistory();
  }
}
