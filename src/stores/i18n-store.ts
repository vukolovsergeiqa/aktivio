import { makeAutoObservable } from 'mobx'

export type Language = 'en' | 'ru' | 'ka'

const TRANSLATIONS: Record<Language, Record<string, any>> = {
  en: {
    nav: {
      add: 'Add Event',
      roleGuest: 'Guest',
      roleAdmin: 'Admin'
    },
    categories: {
      tasting: '🍷 Tastings',
      workshop: '🎨 Workshops',
      tour: '🚶 Tours',
      concert: '🎵 Concerts',
      kids: '👶 Kids',
      yoga: '🧘 Yoga',
      cooking: '🍳 Cooking',
      other: '📌 Other'
    },
    cities: {
      Tbilisi: 'Tbilisi',
      Batumi: 'Batumi',
      Kutaisi: 'Kutaisi',
      Mtskheta: 'Mtskheta',
      Sighnaghi: 'Sighnaghi'
    },
    home: {
      heroTitle: 'All Tbilisi activities in one place',
      heroSub: 'Workshops, tastings, tours and more — find and book in a couple of clicks',
      searchPlaceholder: 'Search events...',
      allCats: '🗓 All',
      allCities: 'All cities',
      nearestEvents: 'Upcoming Events',
      eventsCount: '{count} events',
      nothingFound: 'Nothing found',
      nothingFoundSub: 'Try changing the filters or add a new event'
    },
    event: {
      allEvents: 'All events',
      spots: '{count} spots',
      spotsLeft: '🔥 Only {count} spots left',
      onsite: 'Pay on site',
      free: 'Free',
      perPerson: 'per person',
      bookButton: 'Book a spot',
      paymentOnSiteNote: 'Pay on site · Demo mode',
      organizer: 'Organizer',
      editButton: 'Edit Event',
      deleteButton: 'Delete Event',
      deleteConfirm: 'Delete event "{title}"?',
      bookingsTitle: 'Bookings list ({count})',
      noBookings: 'No bookings for this event yet.',
      guestName: 'Guest name',
      phone: 'Phone',
      payment: 'Payment',
      bookingDate: 'Booking date',
      action: 'Action',
      cancelBooking: 'Cancel booking',
      cancelConfirm: 'Cancel booking for {name}?'
    },
    add: {
      title: 'Add Event',
      subtitle: 'Fill in the information about your event',
      editTitle: 'Edit Event',
      editSubtitle: 'Update the information about your event',
      nameLabel: 'Event name *',
      namePlaceholder: 'e.g. Georgian Cooking Masterclass',
      catLabel: 'Category *',
      descLabel: 'Description',
      descPlaceholder: 'Tell more about the event...',
      dateLabel: 'Date *',
      timeLabel: 'Time *',
      cityLabel: 'City',
      addressLabel: 'Address *',
      addressPlaceholder: 'e.g. 10 Rustaveli Ave',
      priceLabel: 'Price (₾) — 0 = free',
      pricePlaceholder: '50',
      spotsLabel: 'Available spots',
      spotsPlaceholder: '20',
      photoLabel: 'Event photo',
      photoHint: 'Drag & drop photo or click to choose. PNG, JPG up to 10MB',
      organizerLabel: 'Organizer name *',
      organizerPlaceholder: 'Your name or studio brand',
      paymentsLabel: 'Payment Methods (select at least one) *',
      onsiteLabel: 'Pay on site',
      directLabel: 'Direct bank transfer to organizer (TBC / BoG / Phone)',
      bankSectionTitle: 'Bank Details for Transfer',
      bankNameLabel: 'Bank Name *',
      bankRecipientLabel: 'Recipient *',
      bankAccountLabel: 'Account number (IBAN) or Phone *',
      bankAccountPlaceholder: 'GE79BG... or +995...',
      submitButton: 'Publish event',
      submittingButton: 'Publishing...',
      editSubmitButton: 'Save changes',
      editSubmittingButton: 'Saving...',
      deniedTitle: 'Access Restricted',
      deniedText: 'This section is only available for administrators. To add an event, switch to Admin mode in the header.',
      deniedButton: 'Log in as Admin'
    },
    modal: {
      title: 'Book a spot',
      nameLabel: 'Your name *',
      namePlaceholder: 'John Doe',
      phoneLabel: 'Phone number *',
      phonePlaceholder: '+995 599 123 456',
      continueBtn: 'Continue',
      paymentTitle: 'Select Payment Method',
      paymentSub: 'Amount to pay: {price} ₾',
      methodOnsite: 'Pay on site',
      methodOnsiteDesc: 'Cash or card to the organizer on the day of the event',
      methodDirect: 'Direct transfer',
      methodDirectDesc: 'Send via TBC / BoG before the event',
      methodCard: 'Credit Card',
      methodCardDesc: 'Pay via TBC / Bank of Georgia on the website',
      methodApple: 'Apple Pay / Google Pay',
      methodAppleDesc: 'Instant payment in one click',
      bankDetailsTitle: 'Bank details for transfer:',
      bankName: 'Bank:',
      bankRecipient: 'Recipient:',
      bankAccount: 'Phone / IBAN:',
      bankTransferHint: '⚠️ Please transfer {price} ₾ to the details above and save the receipt. The organizer will contact you by phone for confirmation.',
      confirmDirectBtn: 'I transferred, confirm',
      confirmOnsiteBtn: 'Book with payment on site',
      confirmCardBtn: 'Pay {price} ₾ (Test)',
      payingCard: 'Processing payment via TBC Checkout...',
      payingApple: 'Authorizing...',
      successTitle: 'Successfully booked!',
      successText: 'You have registered for "{title}".',
      successSubDirect: 'The organizer will verify the transfer and contact you by phone {phone} shortly.',
      successSubOnsite: 'Amount to pay on site: {price} ₾. The organizer will contact you to confirm details.',
      successSubCard: '🎉 Mock payment complete! {price} ₾ successfully charged. The organizer will contact you at {phone}.',
      successBtn: 'Excellent'
    }
  },
  ru: {
    nav: {
      add: 'Добавить',
      roleGuest: 'Гость',
      roleAdmin: 'Админ'
    },
    categories: {
      tasting: '🍷 Дегустации',
      workshop: '🎨 Мастер-классы',
      tour: '🚶 Экскурсии',
      concert: '🎵 Концерты',
      kids: '👶 Для детей',
      yoga: '🧘 Йога',
      cooking: '🍳 Кулинария',
      other: '📌 Другое'
    },
    cities: {
      Tbilisi: 'Тбилиси',
      Batumi: 'Батуми',
      Kutaisi: 'Кутаиси',
      Mtskheta: 'Мцхета',
      Sighnaghi: 'Сигнахи'
    },
    home: {
      heroTitle: 'Всё интересное Тбилиси в одном месте',
      heroSub: 'Мастер-классы, дегустации, экскурсии и многое другое — находи и бронируй за пару кликов',
      searchPlaceholder: 'Поиск мероприятий...',
      allCats: '🗓 Все',
      allCities: 'Все города',
      nearestEvents: 'Ближайшие мероприятия',
      eventsCount: '{count} событий',
      nothingFound: 'Ничего не найдено',
      nothingFoundSub: 'Попробуйте изменить фильтры или добавьте первое мероприятие'
    },
    event: {
      allEvents: 'Все мероприятия',
      spots: '{count} мест',
      spotsLeft: '🔥 Осталось {count} мест',
      onsite: 'Оплата на месте',
      free: 'Бесплатно',
      perPerson: 'за человека',
      bookButton: 'Забронировать место',
      paymentOnSiteNote: 'Оплата на месте · Демо-режим',
      organizer: 'Организатор',
      editButton: 'Редактировать',
      deleteButton: 'Удалить мероприятие',
      deleteConfirm: 'Удалить мероприятие «{title}»?',
      bookingsTitle: 'Список записей ({count})',
      noBookings: 'Записей на это мероприятие пока нет.',
      guestName: 'Имя гостя',
      phone: 'Телефон',
      payment: 'Оплата',
      bookingDate: 'Дата записи',
      action: 'Действие',
      cancelBooking: 'Отменить запись',
      cancelConfirm: 'Отменить запись гостя {name}?'
    },
    add: {
      title: 'Добавить мероприятие',
      subtitle: 'Заполните информацию о вашем событии',
      editTitle: 'Редактировать мероприятие',
      editSubtitle: 'Обновите информацию о вашем событии',
      nameLabel: 'Название *',
      namePlaceholder: 'Например: Мастер-класс по грузинской кухне',
      catLabel: 'Категория *',
      descLabel: 'Описание',
      descPlaceholder: 'Расскажите подробнее о мероприятии...',
      dateLabel: 'Дата *',
      timeLabel: 'Время *',
      cityLabel: 'Город',
      addressLabel: 'Адрес *',
      addressPlaceholder: 'ул. Руставели, 10',
      priceLabel: 'Цена (₾) — 0 = бесплатно',
      pricePlaceholder: '50',
      spotsLabel: 'Количество мест',
      spotsPlaceholder: '20',
      photoLabel: 'Фото мероприятия',
      photoHint: 'Перетащите фото или нажмите для выбора. PNG, JPG до 10 МБ — сжимается автоматически',
      organizerLabel: 'Имя организатора *',
      organizerPlaceholder: 'Ваше имя или название студии',
      paymentsLabel: 'Способы оплаты (выберите хотя бы один) *',
      onsiteLabel: 'Оплата на месте',
      directLabel: 'Прямой перевод организатору (TBC / BoG / телефон)',
      bankSectionTitle: 'Реквизиты для перевода',
      bankNameLabel: 'Название банка *',
      bankRecipientLabel: 'Получатель *',
      bankAccountLabel: 'Номер счета (IBAN) или телефон *',
      bankAccountPlaceholder: 'GE79BG... или +995...',
      submitButton: 'Опубликовать мероприятие',
      submittingButton: 'Публикуем...',
      editSubmitButton: 'Сохранить изменения',
      editSubmittingButton: 'Сохраняем...',
      deniedTitle: 'Доступ ограничен',
      deniedText: 'Этот раздел доступен только для администраторов. Чтобы добавить мероприятие, переключитесь в режим администратора в шапке.',
      deniedButton: 'Войти как администратор'
    },
    modal: {
      title: 'Запись на мероприятие',
      nameLabel: 'Ваше имя *',
      namePlaceholder: 'Иван Иванов',
      phoneLabel: 'Номер телефона *',
      phonePlaceholder: '+995 599 123 456',
      continueBtn: 'Продолжить',
      paymentTitle: 'Выбор способа оплаты',
      paymentSub: 'Сумма к оплате: {price} ₾',
      methodOnsite: 'Оплата на месте',
      methodOnsiteDesc: 'Наличными или картой организатору в день начала',
      methodDirect: 'Прямой перевод',
      methodDirectDesc: 'По реквизитам на TBC / BoG до мероприятия',
      methodCard: 'Банковская карта',
      methodCardDesc: 'Оплата картой TBC / Bank of Georgia на сайте',
      methodApple: 'Apple Pay / Google Pay',
      methodAppleDesc: 'Быстрая оплата в один клик',
      bankDetailsTitle: 'Реквизиты для перевода:',
      bankName: 'Банк:',
      bankRecipient: 'Получатель:',
      bankAccount: 'Номер телефона / IBAN:',
      bankTransferHint: '⚠️ Пожалуйста, переведите <strong>{price} ₾</strong> по указанным реквизитам и сохраните чек. Организатор свяжется с вами по указанному телефону для подтверждения бронирования.',
      confirmDirectBtn: 'Я перевел сумму, подтвердить',
      confirmOnsiteBtn: 'Забронировать с оплатой на месте',
      confirmCardBtn: 'Оплатить {price} ₾ (Тест)',
      payingCard: 'Обработка платежа TBC Checkout...',
      payingApple: 'Авторизация...',
      successTitle: 'Успешно забронировано!',
      successText: 'Вы записались на мероприятие «{title}».',
      successSubDirect: 'Организатор проверит перевод и свяжется с вами по телефону {phone} в ближайшее время.',
      successSubOnsite: 'Сумма к оплате на месте: {price} ₾. Организатор свяжется с вами для подтверждения деталей.',
      successSubCard: '🎉 Имитация оплаты завершена! Сумма {price} ₾ успешно списана. Организатор свяжется с вами по телефону {phone}.',
      successBtn: 'Отлично'
    }
  },
  ka: {
    nav: {
      add: 'დამატება',
      roleGuest: 'სტუმარი',
      roleAdmin: 'ადმინი'
    },
    categories: {
      tasting: '🍷 დეგუსტაცია',
      workshop: '🎨 მასტერკლასი',
      tour: '🚶 ექსკურსია',
      concert: '🎵 კონცერტი',
      kids: '👶 ბავშვებისთვის',
      yoga: '🧘 იოგა',
      cooking: '🍳 კულინარია',
      other: '📌 სხვა'
    },
    cities: {
      Tbilisi: 'თბილისი',
      Batumi: 'ბათუმი',
      Kutaisi: 'ქუთაისი',
      Mtskheta: 'მცხეთა',
      Sighnaghi: 'სიღნაღი'
    },
    home: {
      heroTitle: 'ყველაფერი საინტერესო თბილისში ერთ ადგილას',
      heroSub: 'მასტერკლასები, დეგუსტაციები, ექსკურსიები და სხვა — იპოვე და დაჯავშნე ორ კლიკში',
      searchPlaceholder: 'ძებნა...',
      allCats: '🗓 ყველა',
      allCities: 'ყველა ქალაქი',
      nearestEvents: 'უახლოესი ღონისძიებები',
      eventsCount: '{count} ღონისძიება',
      nothingFound: 'არაფერი მოიძებნა',
      nothingFoundSub: 'შეცვალეთ ფილტრები ან დაამატეთ პირველი ღონისძიება'
    },
    event: {
      allEvents: 'ყველა ღონისძიება',
      spots: '{count} ადგილი',
      spotsLeft: '🔥 დარჩა {count} ადგილი',
      onsite: 'ადგილზე გადახდა',
      free: 'უფასო',
      perPerson: 'ადამიანზე',
      bookButton: 'ადგილის დაჯავშნა',
      paymentOnSiteNote: 'გადახდა ადგილზე · დემო რეჟიმი',
      organizer: 'ორგანიზატორი',
      editButton: 'რედაქტირება',
      deleteButton: 'ღონისძიების წაშლა',
      deleteConfirm: 'გსურთ წაშალოთ ღონისძიება "{title}"?',
      bookingsTitle: 'ჯავშნების სია ({count})',
      noBookings: 'ღონისძიებაზე ჯერ ჯავშნები არ არის.',
      guestName: 'სახელი',
      phone: 'ტელეფონი',
      payment: 'გადახდა',
      bookingDate: 'თარიღი',
      action: 'მოქმედება',
      cancelBooking: 'ჯავშნის გაუქმება',
      cancelConfirm: 'გსურთ გააუქმოთ ჯავშანი {name}-სთვის?'
    },
    add: {
      title: 'ღონისძიების დამატება',
      subtitle: 'შეავსეთ ინფორმაცია თქვენი ღონისძიების შესახებ',
      editTitle: 'ღონისძиების რედაქტირება',
      editSubtitle: 'განაახლეთ ინფორმაცია ღონისძიების შესახებ',
      nameLabel: 'სახელწოდება *',
      namePlaceholder: 'მაგ: ქართული კულინარიის მასტერკლასი',
      catLabel: 'კატეგორია *',
      descLabel: 'აღწერა',
      descPlaceholder: 'მოგვიყევით ღონისძიების შესახებ...',
      dateLabel: 'თარიღი *',
      timeLabel: 'დრო *',
      cityLabel: 'ქალაქი',
      addressLabel: 'მისამართი *',
      addressPlaceholder: 'მაგ: რუსთაველის გამზ. 10',
      priceLabel: 'ფასი (₾) — 0 = უფასო',
      pricePlaceholder: '50',
      spotsLabel: 'ადგილების რაოდენობა',
      spotsPlaceholder: '20',
      photoLabel: 'ღონისძიების ფოტო',
      photoHint: 'ჩააგდეთ ფოტო ან დააჭირეთ ასარჩევად. PNG, JPG 10 მბ-მდე',
      organizerLabel: 'ორგანიზატორი *',
      organizerPlaceholder: 'თქვენი სახელი ან სტუდიის ბრენდი',
      paymentsLabel: 'გადახდის მეთოდები (აირჩიეთ ერთი მაინც) *',
      onsiteLabel: 'ადგილზე გადახდა',
      directLabel: 'პირდაპირი გადარიცხვა ორგანიზატორთან (TBC / BoG / ტელეფონი)',
      bankSectionTitle: 'საბანკო რეკვიზიტები გადარიცხვისთვის',
      bankNameLabel: 'ბანკის დასახელება *',
      bankRecipientLabel: 'მიმღები *',
      bankAccountLabel: 'ანგარიშის ნომერი (IBAN) ან ტელეფონი *',
      bankAccountPlaceholder: 'GE79BG... ან +995...',
      submitButton: 'ღონისძიების გამოქვეყნება',
      submittingButton: 'ქვეყნდება...',
      editSubmitButton: 'ცვლილებების შენახვა',
      editSubmittingButton: 'ინახება...',
      deniedTitle: 'წვდომა შეზღუდულია',
      deniedText: 'ეს განყოფილება ხელმისაწვდომია მხოლოდ ადმინისტრატორებისთვის. ღონისძიების დასამატებლად გადაერთეთ ადმინისტრატორის რეჟიმზე.',
      deniedButton: 'შესვლა როგორც ადმინისტრატორი'
    },
    modal: {
      title: 'ადგილის დაჯავშნა',
      nameLabel: 'თქვენი სახელი *',
      namePlaceholder: 'სახელი გვარი',
      phoneLabel: 'ტელეფონის ნომერი *',
      phonePlaceholder: '+995 599 123 456',
      continueBtn: 'გაგრძელება',
      paymentTitle: 'გადახდის მეთოდის არჩევა',
      paymentSub: 'გადასახდელი თანხა: {price} ₾',
      methodOnsite: 'ადგილზე გადახდა',
      methodOnsiteDesc: 'ნაღდი ანგარიშსწორებით ან ბარათით ორგანიზატორთან ღონისძიების დღეს',
      methodDirect: 'პირდაპირი გადარიცხვა',
      methodDirectDesc: 'TBC / BoG-ით ღონისძიებამდე',
      methodCard: 'საბანკო ბარათი',
      methodCardDesc: 'ბარათით გადახდა TBC / Bank of Georgia-ით საიტზე',
      methodApple: 'Apple Pay / Google Pay',
      methodAppleDesc: 'სწრაფი გადახდა ერთ კლიკში',
      bankDetailsTitle: 'რეკვიზიტები გადარიცხვისთვის:',
      bankName: 'ბანკი:',
      bankRecipient: 'მიმღები:',
      bankAccount: 'ტელეფონი / IBAN:',
      bankTransferHint: '⚠️ გთხოვთ გადარიცხოთ <strong>{price} ₾</strong> მითითებულ რეკვიზიტებზე და შეინახოთ ქვითარი.',
      confirmDirectBtn: 'გადავრიცხე, დადასტურება',
      confirmOnsiteBtn: 'დაჯავშნა ადგილზე გადახდით',
      confirmCardBtn: 'გადახდა {price} ₾ (ტესტი)',
      payingCard: 'ხდება გადახდის დამუშავება TBC Checkout...',
      payingApple: 'ავტორიზაცია...',
      successTitle: 'წარმატებით დაიჯავშნა!',
      successText: 'თქვენ დარეგისტრირდით ღონისძიებაზე "{title}".',
      successSubDirect: 'ორგანიზატორი შეამოწმებს გადარიცხვას და დაგიკავშირდებათ ნომერზე {phone}.',
      successSubOnsite: 'გადასახდელი თანხა ადგილზე: {price} ₾. ორგანიზატორი დაგიკავშირდებათ დეტალების დასადასტურებლად.',
      successSubCard: '🎉 გადახდა წარმატებულია! {price} ₾ ჩამოიჭრა. ორგანიზატორი დაგიკავშირდებათ ნომერზე {phone}.',
      successBtn: 'კარგი'
    }
  }
}

class I18nStore {
  currentLang: Language = 'en'

  constructor() {
    makeAutoObservable(this)
    this.loadFromStorage()
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('aktivio_lang')
    if (saved === 'en' || saved === 'ru' || saved === 'ka') {
      this.currentLang = saved
    } else {
      this.currentLang = 'en'
    }
  }

  setLanguage(lang: Language) {
    this.currentLang = lang
    localStorage.setItem('aktivio_lang', lang)
  }

  t(path: string, params?: Record<string, string | number>): string {
    const keys = path.split('.')
    let current: any = TRANSLATIONS[this.currentLang]
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return path
      }
    }
    if (typeof current !== 'string') return path

    let text = current
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        text = text.replace(`{${key}}`, String(val))
      })
    }
    return text
  }
}

export const i18nStore = new I18nStore()
