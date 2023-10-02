import {Injectable} from '@angular/core';
import {ServiceType} from "../../../types/service.type";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {RequestTypeType} from "../../../types/request-type.type";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  services: ServiceType[] = [
    {
      id: '1',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      image: './assets/images/service/service1.png',
      price: '7500'
    },
    {
      id: '2',
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      image: './assets/images/service/service2.png',
      price: '3500'
    },
    {
      id: '3',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      image: './assets/images/service/service3.png',
      price: '1000'
    },
    {
      id: '4',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      image: './assets/images/service/service4.png',
      price: '750'
    }
  ]

  constructor(private http: HttpClient) {}

  getServices(): ServiceType[]{
    return this.services;
  }

  addRequests(name: string, phone: string, type: RequestTypeType, service?: string | null): Observable<DefaultResponseType> {
    let body:{ name: string, phone: string, type: RequestTypeType, service?: string} = {
      name: name,
      phone: phone,
      type: type
    };
    if(type === RequestTypeType.order && service){
      body.service = service;
    }

    return this.http.post<DefaultResponseType>(environment.api + 'requests', body);

  }

}
