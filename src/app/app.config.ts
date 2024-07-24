import { HttpClient, HttpClientModule, provideHttpClient } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { appRoutes } from "./app.routes";
import { BrowserModule } from "@angular/platform-browser";
import { IconsProviderModule } from "./shared/modules/icons-provider.module";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxPermissionsModule, NgxPermissionsService } from "ngx-permissions";
import { AngularYandexMapsModule, YaConfig } from "angular8-yandex-maps";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
};

const mapConfig: YaConfig = {
    apikey: 'df0cb391-97e5-47ce-a954-f54cb0644e56',
    lang: 'ru_RU'
};


export const appConfig: ApplicationConfig = {
    providers: [
        NzNotificationService,
        importProvidersFrom(NgxPermissionsModule.forRoot()),
        importProvidersFrom(AngularYandexMapsModule.forRoot(mapConfig)),
        provideAnimations(),
        provideHttpClient(),
        importProvidersFrom(BrowserModule, BrowserAnimationsModule, IconsProviderModule),
        provideRouter(appRoutes),
        importProvidersFrom(
            HttpClientModule,
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            })
        )
    ],
};
