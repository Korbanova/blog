import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ServiceType} from "../../../types/service.type";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {ServicesService} from "../../shared/services/services.service";
import {OwlOptions} from "ngx-owl-carousel-o";
import {BannersType} from "../../../types/banners.type";
import {OrderCallComponent} from "../../shared/components/order-call/order-call.component";
import {RequestTypeType} from "../../../types/request-type.type";
import {MatDialog} from "@angular/material/dialog";
import {AdvantageType} from "../../../types/advantage.type";
import {Observable} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent{
  services: ServiceType[] = [];
  topArticles?: Observable<ArticleType[]>;

  banners: BannersType[] = [
    {
      id: '1',
      image: 'banner2.png',
      name: 'Акция',
      title: "Нужен грамотный <span>копирайтер</span>?",
      body: "Весь декабрь у нас действует акция на работу копирайтера."
    },
    {
      id: '2',
      image: 'banner1.png',
      name: 'Предложение месяца',
      title: "Продвижение в Instagram для вашего бизнеса <span>-15%</span>!"
    },
    {
      id: '3',
      image: 'banner3.png',
      name: 'Новость дня',
      title: "<span>6 место</span> в ТОП&#8209;10 SMM&#8209;агенств Москвы!",
      body: "Мы благодарим каждого, кто голосовал за нас!"
    },
  ];
  advantages: AdvantageType[] = [
    {
      number: '1',
      text: "<span>Мастерски вовлекаем аудиториюв процесс.</span> Мы увеличиваем процент вовлечённости за короткий промежуток времени."
    },
    {
      number: '2',
      text: "<span>Разрабатываем бомбическую визуальную концепцию.</span> Наши специалисты знают как создать уникальный образ вашего проекта."
    },
    {
      number: '3',
      text: "<span>Создаём мощные воронки с помощью текстов.</span> Наши копирайтеры создают не только вкусные текста, но и классные воронки."
    },
    {
      number: '4',
      text: "<span>Помогаем продавать больше.</span> Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика."
    },

  ];
  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },

  ];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    dotsData: true,
    navSpeed: 700,
    navText: ['', ''],
    startPosition: '1',
    responsive: {
      0: {
        items: 1
      },
    },
    nav: false
  };
  customOptionsReviews: OwlOptions = {
    loop: true,

    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 23,
    items: 3,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      810: {
        items: 2,
      },
      1240: {
        items: 3,
      },
    },
    nav: false
  }

  constructor(private articleService: ArticleService,
              private servicesService: ServicesService,
              private dialog: MatDialog) {
    this.services = servicesService.getServices();
    this.topArticles = articleService.getTopArticles();
  }

  openPopup() {
    this.dialog.open(OrderCallComponent, {
      data: {type: RequestTypeType.order}
    });
  }
}
