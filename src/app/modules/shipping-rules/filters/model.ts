import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {FilterService} from '../../../filters/filter-servise';
import {IFilterConfig, IFilterService} from '../../../filters/interface';


const aaa = [
  {
    key: 'Allow',
    value: 'ALLOW'
  },
  {
    key: 'Deny',
    value: 'DENNY'
  }
]

@Injectable()
export class ShippingRulesFilter extends FilterService implements IFilterService {

  /**
   * Итак енум для фильтра может быть статичен - его можно передать внутри конфига.
   * Может быть загружаемым из внешнего источника.
   * а) загружаем его при создании фильтра и передаем в качестве конфига.
   * б) передаем в конфиг источник, а тот кому потребуется будет его использовать.
   *
   * По мере использования фильтра - может понадобиться логика взаимодействия между атрибутами.
   * Например при выборе одно из атрибутов - включается другой атрибут и его значения подгружаются или отфильтровываются из исходного массива.
   *
   * В случае с подписчиком - это имеет смысл так как мы можем предоставлять данные из одного места для всего приложения.
   * Так например список доступных пользователю хабов - может использоваться в фильтре, при создании правила и т.п.
   * Становится вопрос актуальности данных и возможности запросить эти данные.
   * Получение данных - они начинают появляться как только кто-то подписывается?
   * Просто если это подписчик, то данные уже должны быть в например в енаме. Это может создать проблемы если уже все загружено а потом произошла ошибка.
   * В этом случае нам требуется произвести загрузку (инициализацию сервиса до загрузки страницы, но после гварда).
   * Т.е. в резолве мы создаем источник и запускаем его наполнение - по итогу возвращаем ок или нет.
   * Если ок  - то юзаем его как источник данных. Но он подходит только для получения статических данных (подписка только обеспечивает возможность обновить спустя время и отправить новые)
   *
   * Напрашивается некий сервис ИсточникДанных - который может дать ресурс для подписки а так же предоставить возможность сообщать ему о факте необходимости данных (например по этому факту он может проверить время кеша и запросить где-то еще обновленные данные).
   * Как в таком случае строится взаимодействие с Источником.
   *
   * Фильтр единожды подписывается на Источник и ждет от него данных. Каждый раз когда они меняются он использует новую версию списка.
   *
   * Таким же образом мы можем из статических данных создавать источники и использовать их в компонентах. Например если мы передали какой-то статический енум, то:
   * создаем Источник и посылаем сообщение с этим значением. При использовании метода SetEnum - мы сохраняем новое значение и сообщаем через next() новое значение.
   *
   * Хм. Кому сообщаем? Для компонентов єто значение должно быть статическим. Все подписки и обновления происходят внутри объекта фильтра....
   *
   *
   * enum: EnumList | Observable<EnumList> | (filter) => EnumList
   *
   *
   *
   *
   * !!! Может быть стоит различать источник енумов в фильтре и само значение фильтра.
   * Так например мы можем получить подписку в которой прилетит 100500 значений. И как быть если нам надо отфильтровать?
   * !!)) Так ведь то что прилетело мы сохраняем как статику и потом фильтруем ее.
   *
   * Но если мы например отфильтровали, а пом надо сбросить фильтр? Где брать данные)))
   * А не должен ли этим заниматься сервис фильтров - зная при этом где брать данные и как фильтровать между собой)
   *
   */
  $config(): IFilterConfig {
    return {
      id: {
        type: 'LIKE_INT',
        ui: 'input:text',
        label: 'Rule ID',
        hint: null,
      },

      /** Just show select with values */
      action: {
        type: 'EQUAL_ENUM',
        ui: 'select',
        label: 'Action',
        enum: [
          {
            key: 'Allow',
            value: 'ALLOW'
          },
          {
            key: 'Deny',
            value: 'DENNY'
          }
        ],
      },

      action2: {
        type: 'EQUAL_ENUM',
        ui: 'select',
        label: 'Action2',
        enum: aaa,
      },

      /** Show select based on data from... BackEnd... Some service with data. */
      hub: {
        type: 'EQUAL_ENUM',
        ui: 'select',
        label: 'Hub',
        enum: this.gotObservable
      },

      testFn: {
        enabled: false,
        type: 'EQUAL_ENUM',
        label: 'test',
        enum: this.someEnumListFunction,
      },

      testFn2: {
        type: 'EQUAL_ENUM',
        label: 'test2',
        enum: of<{key:string, value: number}[]>([{key:'off1',value: 1}, {key:'off2', value:3}] )
      },

      date: {
        type: 'RANGE_DATE',
        label: 'Created At',
      }
    }
  }

  /**
   * Use constructor for pre-configure filter
   * @??? can inject some and use it in config?
   * @??? can extend after create base from parent?
   */
  constructor() {
    console.log('ShippingRulesFilter constructor');
    super();
  }

  /**
   * Custom function for return static enum list
   */
  someEnumListFunction(filter) {
    // console.log('someEnumListFunction RUNNED');
    return [
      { key: 'some1', value: 55 },
      { key: 'some2', value: 56 },
    ];
  }

  /**
   * Custom function for return enum as Observable resource
   */
  gotObservable() {
    return of<{key:string, value: number}[]>([{key:'fob',value: 10}, {key:'fob2', value:30}] )
  }

}
