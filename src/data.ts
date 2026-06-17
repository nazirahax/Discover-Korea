import { HangulChar, Phrase, Hotspot, QuizQuestion } from "./types";

export const HANGUL_CHARS: HangulChar[] = [
  // Consonants
  { char: "ㄱ", name: "Киёк (기역)", pronunciation: "К / Г", type: "consonant", example: "가다 (kada)", exampleTrans: "када", meaning: "Идти" },
  { char: "ㄴ", name: "Ниын (니은)", pronunciation: "Н", type: "consonant", example: "나라 (nara)", exampleTrans: "нара", meaning: "Страна" },
  { char: "ㄷ", name: "Тиыт (디귿)", pronunciation: "Т / Д", type: "consonant", example: "더하기 (deohagi)", exampleTrans: "дохаги", meaning: "Сложение" },
  { char: "ㄹ", name: "Риыль (리을)", pronunciation: "Р / Л", type: "consonant", example: "라디오 (radio)", exampleTrans: "радио", meaning: "Радио" },
  { char: "ㅁ", name: "Миым (미음)", pronunciation: "М", type: "consonant", example: "마음 (maum)", exampleTrans: "маум", meaning: "Душа / Сердце" },
  { char: "ㅂ", name: "Пиып (비읍)", pronunciation: "П / Б", type: "consonant", example: "바보 (babo)", exampleTrans: "пабо", meaning: "Глупец" },
  { char: "ㅅ", name: "Сиот (시옷)", pronunciation: "С / Ш", type: "consonant", example: "사랑 (sarang)", exampleTrans: "саранг", meaning: "Любовь" },
  { char: "ㅇ", name: "Иын (이응)", pronunciation: "Немой / НГ", type: "consonant", example: "안녕 (annyeong)", exampleTrans: "аннён", meaning: "Привет" },
  { char: "ㅈ", name: "Тиыт (지읒)", pronunciation: "Ч / Дж", type: "consonant", example: "지도 (jido)", exampleTrans: "чидо", meaning: "Карта" },
  { char: "ㅊ", name: "Чхиыт (치읓)", pronunciation: "Чх", type: "consonant", example: "친구 (chingu)", exampleTrans: "чхингу", meaning: "Друг" },
  { char: "ㅋ", name: "Кхыыт (키읔)", pronunciation: "Кх", type: "consonant", example: "코 (ko)", exampleTrans: "кхо", meaning: "Нос" },
  { char: "ㅌ", name: "Тхыыт (티읕)", pronunciation: "Тх", type: "consonant", example: "토끼 (tokki)", exampleTrans: "тхокки", meaning: "Кролик" },
  { char: "ㅍ", name: "Пхыыт (피읖)", pronunciation: "Пх", type: "consonant", example: "피자 (pija)", exampleTrans: "пхиджа", meaning: "Пицца" },
  { char: "ㅎ", name: "Хиыт (히응)", pronunciation: "Х", type: "consonant", example: "하늘 (haneul)", exampleTrans: "ханыль", meaning: "Небо" },

  // Vowels
  { char: "ㅏ", name: "А (아)", pronunciation: "А", type: "vowel", example: "아이 (ai)", exampleTrans: "аи", meaning: "Ребенок" },
  { char: "ㅑ", name: "Я (야)", pronunciation: "Я", type: "vowel", example: "야구 (yagu)", exampleTrans: "ягу", meaning: "Бейсбол" },
  { char: "ㅓ", name: "О (어)", pronunciation: "О (открытый)", type: "vowel", example: "어머니 (eomeoni)", exampleTrans: "омони", meaning: "Мать" },
  { char: "ㅕ", name: "Ё (여)", pronunciation: "Ё (открытый)", type: "vowel", example: "여우 (yeou)", exampleTrans: "ёу", meaning: "Лиса" },
  { char: "ㅗ", name: "О (오)", pronunciation: "О (закрытый)", type: "vowel", example: "오이 (oi)", exampleTrans: "ои", meaning: "Огурец" },
  { char: "ㅛ", name: "Ё (요)", pronunciation: "Ё (закрытый)", type: "vowel", example: "요리 (yori)", exampleTrans: "ёри", meaning: "Кулинария" },
  { char: "ㅜ", name: "У (우)", pronunciation: "У", type: "vowel", example: "우유 (uyu)", exampleTrans: "ую", meaning: "Молоко" },
  { char: "ㅠ", name: "Ю (유)", pronunciation: "Ю", type: "vowel", example: "유리 (yuri)", exampleTrans: "юри", meaning: "Стекло" },
  { char: "ㅡ", name: "Ы (으)", pronunciation: "Ы", type: "vowel", example: "음악 (eumak)", exampleTrans: "ымак", meaning: "Музыка" },
  { char: "ㅣ", name: "И (이)", pronunciation: "И", type: "vowel", example: "이름 (ireum)", exampleTrans: "ирым", meaning: "Имя" }
];

export const PHRASEBOOK: Phrase[] = [
  // Greetings
  { korean: "안녕하세요", romanization: "An-nyeong-ha-se-yo", translation: "Здравствуйте", category: "greetings", context: "Стандартное вежливое приветствие на все случаи жизни." },
  { korean: "감사합니다", romanization: "Gam-sa-ham-ni-da", translation: "Спасибо", category: "greetings", context: "Самая вежливая и распространенная форма благодарности." },
  { korean: "만나서 반갑습니다", romanization: "Man-na-seo ban-gap-seum-ni-da", translation: "Приятно познакомиться", category: "greetings" },
  { korean: "잘 지내셨어요?", romanization: "Jal ji-nae-syeot-seo-yo?", translation: "Как ваши дела?", category: "greetings" },
  { korean: "안녕히 계세요", romanization: "An-nyeong-hi gye-se-yo", translation: "До свидания (если вы уходите, а хозяин остается)", category: "greetings" },
  { korean: "안녕히 가세요", romanization: "An-nyeong-hi ga-se-yo", translation: "До свидания (если собеседник уходит)", category: "greetings" },
  { korean: "죄송합니다", romanization: "Joe-song-ham-ni-da", translation: "Извините / Прошу прощения", category: "greetings" },

  // Dining
  { korean: "메뉴판 좀 주세요", romanization: "Me-nyu-pan jom ju-se-yo", translation: "Дайте, пожалуйста, меню", category: "dining" },
  { korean: "이거 주세요", romanization: "I-geo ju-se-yo", translation: "Пожалуйста, дайте вот это (указывая пальцем)", category: "dining" },
  { korean: "물 좀 주세요", romanization: "Mul jom ju-se-yo", translation: "Дайте, пожалуйста, воды", category: "dining", context: "Вода в корейских ресторанах практически всегда бесплатна." },
  { korean: "덜 맵게 해주세요", romanization: "Deol maep-ge hae-ju-se-yo", translation: "Сделайте, пожалуйста, менее острым", category: "dining", context: "Спасительная корейская фраза для иностранцев!" },
  { korean: "맛있게 드세요", romanization: "Mas-it-ge deu-se-yo", translation: "Приятного аппетита", category: "dining" },
  { korean: "잘 먹었습니다", romanization: "Jal meog-eot-seum-ni-da", translation: "Спасибо за еду (букв. Я хорошо поел)", category: "dining" },
  { korean: "계산서 주세요", romanization: "Gye-san-seo ju-se-yo", translation: "Пожалуйста, принесите счет", category: "dining" },

  // Shopping
  { korean: "이거 얼마예요?", romanization: "I-geo eol-ma-ye-yo?", translation: "Сколько это стоит?", category: "shopping" },
  { korean: "조금 깎아주세요", romanization: "Jo-geum kkak-a-ju-se-yo", translation: "Сделайте небольшую скидку, пожалуйста", category: "shopping", context: "Полезно на традиционных рынках вроде Намдэмун." },
  { korean: "카드로 계산할게요", romanization: "Ka-deu-ro gye-san-hal-ge-yo", translation: "Я оплачу картой", category: "shopping" },
  { korean: "봉투 필요해요", romanization: "Bong-tu pil-yo-hae-yo", translation: "Мне нужен пакет", category: "shopping" },
  { korean: "환불해 주세요", romanization: "Hwan-bul-hae ju-se-yo", translation: "Оформите возврат, пожалуйста", category: "shopping" },

  // Transport
  { korean: "역이 어디예요?", romanization: "Yeog-i eo-di-ye-yo?", translation: "Где находится станция метро?", category: "transport" },
  { korean: "티머니 카드 충전해 주세요", romanization: "T-money ka-deu chung-jeon-hae ju-se-yo", translation: "Пополните транспортную карту T-money, пожалуйста", category: "transport" },
  { korean: "여기서 세워주세요", romanization: "Yeo-gi-seo se-wo-ju-se-yo", translation: "Остановите здесь, пожалуйста (в такси)", category: "transport" },
  { korean: "출구 어디예요?", romanization: "Chul-gu eo-di-ye-yo?", translation: "Где выход?", category: "transport" },

  // Emergency
  { korean: "도와주세요!", romanization: "Do-wa-ju-se-yo!", translation: "Помогите!", category: "emergency" },
  { korean: "경찰을 불러주세요", romanization: "Gyeong-chal-eul bul-leo-ju-se-yo", translation: "Вызовите полицию", category: "emergency" },
  { korean: "병원에 가야 해요", romanization: "Byeong-won-e ga-ya hae-yo", translation: "Мне нужно в больницу", category: "emergency" },
  { korean: "약국이 어디에 있나요?", romanization: "Yak-guk-i eo-di-e in-na-yo?", translation: "Где здесь аптека?", category: "emergency" }
];

export const HOTSPOTS: Hotspot[] = [
  {
    id: "gyeongbokgung",
    title: "Дворец Кёнбоккун",
    koreanTitle: "경복궁",
    category: "history",
    description: "Величественный императорский дворец династии Чосон в самом сердце Сеула.",
    fullDetails: "Главный и крупнейший дворец династии Чосон, построенный в 1395 году. Название переводится как 'Дворец сияющего счастья'. Здесь можно увидеть торжественную смену караула в старинных военных одеждах, прогуляться у пруда рядом с павильоном Кёнхверу и сделать невероятные фото. Если прийти в традиционном корейском костюме Ханбок, вход во дворец будет абсолютно бесплатным!",
    recommendedTime: "2-3 часа (лучше утром с 10:00 до смены караула)",
    imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    culturalInsight: "Дворцовая геомантия (풍수 - Пхунсу): Кёнбоккун идеально расположен спиной к горе Бугаксан и фронтом к реке Ханган, воплощая гармонию Инь-Ян.",
    location: "Сеул, ст. метро Gyeongbokgung"
  },
  {
    id: "bukchon",
    title: "Деревня Букчхон Ханок",
    koreanTitle: "북촌한옥마을",
    category: "history",
    description: "Живописный исторический квартал с традиционными жилыми домами 'ханок'.",
    fullDetails: "Старинный жилой район, раскинувшийся между дворцами Кёнбоккун и Чхандоккун. Здесь до сих пор живут люди, поэтому на улочках рекомендуется соблюдать тишину. Дома построены из глины, дерева и камня, с изогнутыми черепичными крышами. Сегодня в залах многих ханоков располагаются чайные домики, галереи искусств и мастерские каллиграфии.",
    recommendedTime: "1.5 - 2 часа (удобно совместить с дворцами)",
    imageUrl: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80",
    culturalInsight: "Огненная система ондоль (온돌): уникальный подогрев полов дымом из печи, на которых корейцы спали, ели и собирались всей семьей в уюте холодной зимой.",
    location: "Сеул, ст. метро Anguk"
  },
  {
    id: "jeju",
    title: "Остров Чеджу",
    koreanTitle: "제주도",
    category: "nature",
    description: "Остров трех изобилий: базальтовых ветров, гордов и знаменитых женщин-ныряльщиц.",
    fullDetails: "Главный корейский курорт, образованный мощным вулканическим взрывом. Здесь вы обнаружите спящий вулкан Халласан, причудливые лавовые трубки Ман장гуль, невероятные пляжи с бирюзовой водой и плантации сочных зеленых мандаринов. Чеджу также окутан загадками: повсюду стоят грозные каменные дедушки Харыбаны из лавового камня.",
    recommendedTime: "3-4 дня (требуется перелет или паром)",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    culturalInsight: "Хэнё (해녀): легендарные ныряльщицы за морепродуктами без всякого кислородного оборудования. Средний возраст этих невероятных женщин превышает 65 лет!",
    location: "Провинция Чеджу"
  },
  {
    id: "haeundae",
    title: "Пляж Хэундэ в Пусане",
    koreanTitle: "해운대해수욕장",
    category: "modern",
    description: "Знаменитый песчаный пляж с роскошной набережной и небоскребами.",
    fullDetails: "Пусан — второй по размеру мегаполис и крупнейший порт Кореи, известный своим драйвом и морским вайбом. Пляж Хэундэ — его визитная карточка. Днем это километры золотого песка с синими зонтиками, а ночью — блистательный залив с грандиозным мостом Кванан-тэгё, зажигающимся миллионами неоновых огней.",
    recommendedTime: "Полдня или вечер (с прогулкой по рыбному рынку Чагальчхи)",
    imageUrl: "https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?auto=format&fit=crop&w=800&q=80",
    culturalInsight: "Романтика Пусана: местные жители обожают собираться на набережной, есть сырую рыбу (Хве), печь сладкие пирожки хотток на углях и слушать уличных музыкантов.",
    location: "Пусан, ст. метро Haeundae"
  },
  {
    id: "gyeongju",
    title: "Кёнчжу — музей без стен",
    koreanTitle: "경주",
    category: "history",
    description: "Древнейшая столица Золотого королевства Силла с королевскими гробницами.",
    fullDetails: "Колыбель корейской государственности и духовной культуры. Кёнчжу наполнен зеленеющими курганами — это гробницы великих ванов (царей), в которых находили чистейшее силлаское золото. Здесь же расположена старейшая в Азии обсерватория Чхомсондэ, буддийский храм Пульгукса с гранитными пагодами и таинственный грот Соккурам.",
    recommendedTime: "1-2 дня (удобно доехать на скоростном поезде KTX)",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80",
    culturalInsight: "Символ Силла: золотые короны правителей с подвесками в виде яшмы и нефритовых эмбрионов, олицетворяющих бессмертие и рождение вселенной.",
    location: "Провинция Кёнсан-Пукто"
  }
];

export const CULTURE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Как правильно передавать или забирать визитку, подарок или деньги вежливому корейцу?",
    options: [
      "Строго левой рукой, прижав правую к груди",
      "Обязательно двумя руками с легким поклоном",
      "Одной рукой, но бросая с улыбкой на стол",
      "Только через посредника"
    ],
    correctIndex: 1,
    info: "Держать предмет двумя руками при дарении или получении выражает глубокое уважение. Если передаете одной рукой, локоть дающей руки принято мягко поддерживать левой рукой."
  },
  {
    id: 2,
    question: "Что празднуется в Южной Корее в первый день десятого месяца лунного календаря или 9 октября?",
    options: [
      "День изобретения Кимчи",
      "День победы адмирала Ли Сунсина",
      "День Хангыля (корейского алфавита)",
      "День основания K-Pop корпораций"
    ],
    correctIndex: 2,
    info: "День Хангыля отмечает создание и объявление королем Сечжоном Великим уникального и легкого для освоения алфавита Хангыль в 1446 году."
  },
  {
    id: 3,
    question: "Какая цифра считается несчастливой в Корее (так как созвучна со словом 'смерть'), часто в лифтах ее заменяют латинской буквой 'F'?",
    options: ["Цифра 13", "Цифра 4", "Цифра 7", "Цифра 9"],
    correctIndex: 1,
    info: "Цифра 4 по-корейски произносится как Са (사), что звучит идентично китайскому иероглифу 'смерть'. Это явление называется тетрафобией."
  },
  {
    id: 4,
    question: "Какое блюдо традиционно едят корейцы в день рождения или роженицы для быстрого восстановления сил?",
    options: [
      "Острый Рамён",
      "Миёк-гук (суп из морских водорослей)",
      "Свиные ножки Чокпаль",
      "Сладкие рисовые лепешки Тток"
    ],
    correctIndex: 1,
    info: "Суп Миёк-гук богат железом и йодом. Его употребление на день рождения — это дань благодарности матери за ее заботу и символ зарождения новой жизни."
  },
  {
    id: 5,
    question: "Что корейские студенты и школьники категорически НЕ едят перед важными экзаменами, боясь 'соскользнуть' с хорошей оценки?",
    options: [
      "Суп с лапшой или скользкие водоросли",
      "Жареную острую курицу",
      "Твердые яблоки",
      "Горький шоколад"
    ],
    correctIndex: 0,
    info: "По корейскому народному поверью, если есть перед экзаменами скользкую пищу (как суп Миёкгук), то знания 'выскользнут' из головы. Зато перед тестами едят липкий ирис или рисовый хлебец 'Ет', чтобы знания намертво 'прилипли'."
  }
];
