import LocalizedStrings from "react-native-localization";
import {Text} from "react-native";
import React from "react";

// CommonJS syntax
// let LocalizedStrings  = require ("react-native-localization");

let lang = new LocalizedStrings({

    en:{
        // Nav
        nav_home: "HOME",
        nav_movies: "MOVIES",
        nav_show: "SHOWS",
        nav_kids: "KIDS",
        nav_tv: "LIVE TV",
        nav_logout: "LOGOUT",

        recently_watch: "RECENTLY WATCH",
        noItems: "There are no movies and TV series",
        find_what: "Find what to watch next.",
        search_for: "Search for shows & movies or actors",

        actors: "Actors",
        shows_and_movie: "TV Show & Movies",
        movie: "Movie",
        show: "Show",

        year: "Year",
        trailer: "Trailer",
        my_list: "My List",
        like: "Like",
        dislike: "Dislike",
        share: "Share",
        genres: "Genres",
        recommendation: "Recommendation",
        create: "Create",

        // auth
        login: "LOGIN",
        signup: "SIGN UP",
        signupSM: "Sign Up",
        welcome_back: "Welcome Back",
        forget_password: "Forget Password",
        create_account: "Create Your Account",
        continue: "CONTINUE",
        email: "E-mail",
        password: "Password",
        re_password: "Re-enter password",
        username: "Username",
        current_password: "You current password",

        // collection
        notItemsInCollection: "There is no movies or shows in this collection.",
        noList: "There is no collections",
        add_new_collection: "Add in new collection",

        // Player
        disable: "Disable",
        resolution: "Resolution",
        subtitle: "subtitle",
        loading: "Loading",
        ok: "OK",
        live: "Live",

        // settings
        settings: "Settings",
        profile: "Profile",
        security: "Security",
        device_activity: "Device Activity",
        history_watch: "History Watch",
        update: "UPDATE"

    },

    es: {
       nav_home: "CASA",
       nav_movies: "PELÍCULAS",
       nav_show: "SHOWS",
       nav_kids: "Niños",
       nav_tv: "TV EN VIVO",
       nav_logout: "CERRAR SESIÓN",
       recently_watch: "VEA RECIENTEMENTE",
       noItems: "No hay películas ni series de televisión",
       find_what: "Encuentra qué ver a continuación",
       search_for: "Búsqueda de espectáculos y películas o actores",
       actors: "Actores",
       shows_and_movie: "Programa de televisión y películas",
       movie: "Película",
       show: "Show",
       year: "Año",
       trailer: "Remolque",
       my_list: "Mi lista",
       like: "Me gusta",
       dislike: "Disgusto",
       share: "Compartir",
       genres: "Géneros",
       recommendation: "Recomendación",
       create: "Crear",
       login: "INICIAR SESIÓN",
       signup: "REGÍSTRATE",
       signupSM: "Regístrate",
       welcome_back: "Dar una buena acogida",
       forget_password: "Contraseña olvidada",
       create_account: "Crea tu cuenta",
       continue: "CONTINUAR",
       email: "Email",
       password: "Contraseña",
       re_password: "Escriba la contraseña otra vez",
       username: "Nombre de usuario",
       current_password: "Tu contraseña actual",
       notItemsInCollection: "No hay películas o programas en esta colección.",
       noList: "No hay una lista",
       add_new_collection: "Añadir en nueva colección",
       disable: "Inhabilitar",
       resolution: "Resolución",
       subtitle: "subtitular",
       loading: "Cargando",
       ok: "DE ACUERDO",
       live: "Vivir",
       settings: "Ajustes",
       profile: "Perfil",
       security: "Seguridad",
       device_activity: "Actividad del dispositivo",
       history_watch: "History Watch",
       update: "ACTUALIZAR"
    },

    tr: {

        nav_home: "ANA SAYFA",
        nav_movies: "Fılmler",
        nav_show: "televizyon şovları",
        nav_kids: "Çocuklar",
        nav_tv: "Canel TV",
        nav_logout: "LOGOUT",
        recently_watch: "SON IZLEME",
        noItems: "Film ve TV dizisi yok",
        find_what: "Sonraki izlemek için ne bulun.",
        search_for: "Gösteriler ve filmler veya aktörler için arama",
        actors: "Aktörler ",
        shows_and_movie: "TV show & Filmler",
        movie: "Film",
        show: "televizyon şovları",
        year: "Yıl ",
        trailer: "Trailer",
        my_list: "Listemde",
        like: "Like",
        dislike: "Sevmediğim ",
        share: "Paylaş",
        genres: "Türler",
        recommendation: "Öneri",
        create: "Create",
        login: "Oturum aç",
        signup: "KAYıT OL",
        signupSM: "Kayıt ol",
        welcome_back: "Geri hoş geldiniz",
        forget_password: "Şifreyi unut",
        create_account: "Hesabınızı oluşturun",
        continue: "Devam",
        email: "E-posta",
        password: "Şifre ",
        re_password: "Parolayı yeniden girin",
        username: "Kullanıcı adı ",
        current_password: "Geçerli parola ",
        notItemsInCollection: "Bu koleksiyonda film veya gösteri yok.",
        noList: "Liste yok.",
        add_new_collection: "Yeni koleksiyona Ekle",
        disable: "Devre dışı",
        resolution: "Çözünürlük",
        subtitle: "Subtitle",
        loading: "Yükleme",
        ok: "Tamam",
        live: "Canlı ",
        settings: "Ayarlar",
        profile: "Profil",
        security: "Güvenlik",
        device_activity: "Cihaz aktivitesi",
        history_watch: "Tarih saati",
        update: "GÜNCELLEŞTIRME"

    },

    fr: {

        nav_home: "MAISON",
        nav_movies: "FILMS",
        nav_show: "SPECTACLES",
        nav_kids: "DES GAMINS",
        nav_tv: "EN DIRECT",
        nav_logout: "CONNECTEZ - OUT",
        recently_watch: "REGARDEZ RÉCEMMENT",
        noItems: "Il n'y a pas de films et de séries télé",
        find_what: "Trouver quoi regarder ensuite.",
        search_for: "Rechercher des spectacles et des films ou des acteurs",
        actors: "Acteurs",
        shows_and_movie: "Séries télé et films",
        movie: "Film",
        show: "Spectacle",
        year: "Année",
        trailer: "Bande annonce",
        my_list: "Ma liste",
        like: "Comme",
        dislike: "Ne pas aimer",
        share: "Partager",
        genres: "Genres",
        recommendation: "Recommandation",
        create: "Créer",
        login: "S'IDENTIFIER",
        signup: "S'INSCRIRE",
        signupSM: "S'inscrire",
        welcome_back: "Nous saluons le retour",
        forget_password: "Mot de passe oublié",
        create_account: "Créez votre compte",
        continue: "CONTINUER",
        email: "Email",
        password: "Mot de passe",
        re_password: "Retaper le mot de passe",
        username: "Nom d'utilisateur",
        current_password: "Votre mot de passe actuel",
        notItemsInCollection: "Il n'y a pas de films ou d'émissions dans cette collection",
        noList: "Il n'y a pas de liste.",
        add_new_collection: "Ajouter dans nouvelle collection",
        disable: "Désactiver",
        resolution: "Résolution",
        subtitle: "Sous-titre",
        loading: "Chargement",
        ok: "D'ACCORD",
        live: "Vivre",
        settings: "Réglages",
        profile: "Profil",
        security: "Sécurité",
        device_activity: "Activité du périphérique",
        history_watch: "Regard sur l'histoire",
        update: "METTRE À JOUR"

    },

    de: {

       nav_home: "ZUHAUSE",
       nav_movies: "FILME",
       nav_show: "ZEIGT AN",
       nav_kids: "KINDER",
       nav_tv: "LIVE FERNSEHEN",
       nav_logout: "AUSLOGGEN",
       recently_watch: "ZULETZT UHR",
       noItems: "Es gibt keine Filme und Fernsehserien",
       find_what: "Finden Sie, was Sie als nächstes sehen sollen.",
       search_for: "Suche nach Shows & Filmen oder Schauspielern",
       actors: "Schauspieler",
       shows_and_movie: "TV-Show & Filme",
       movie: "Film",
       show: "Show",
       year: "Jahr",
       trailer: "Anhänger",
       my_list: "Meine Liste",
       like: "Mögen",
       dislike: "Nicht gefallen",
       share: "Aktie",
       genres: "Genres",
       recommendation: "Empfehlung",
       create: "Erstellen",
       login: "ANMELDUNG",
       signup: "ANMELDEN",
       signupSM: "Anmelden",
       welcome_back: "Willkommen zurück",
       forget_password: "Passwort vergessen",
       create_account: "Erstelle deinen Account",
       continue: "FORTSETZEN",
       email: "Email",
       password: "Passwort",
       re_password: "Kennwort erneut eingeben",
       username: "Nutzername",
       current_password: "Ihr aktuelles Passwort",
       notItemsInCollection: "Diese Sammlung enthält keine Filme oder Shows",
       noList: "Es gibt keine Liste.",
       add_new_collection: "Hinzufügen in neuer Sammlung",
       disable: "Deaktivieren",
       resolution: "Auflösung",
       subtitle: "Untertitel",
       loading: "Wird geladen",
       ok: "OK",
       live: "Leben",
       settings: "Die Einstellungen",
       profile: "Profil",
       security: "Sicherheit",
       device_activity: "Geräteaktivität",
       history_watch: "History Watch",
       update: "AKTUALISIEREN"

    },

    in: {
      nav_home:  "होम",
      nav_movies:  "चलचित्र",
      nav_show:  "दिखाता है",
      nav_kids:  "किड्स",
      nav_tv:  "लाइव टीवी",
      nav_logout:  "लोग आउट",
      recently_watch:  "हाल ही में",
      noItems:  "फिल्में और टीवी श्रृंखला नहीं हैं",
      find_what:  "आगे क्या देखना है यह पता लगाएं।",
      search_for:  "शो और फिल्मों या अभिनेताओं के लिए खोजें",
      actors:  "अभिनेता",
      shows_and_movie:  "टीवी शो और फिल्में",
      movie:  "चलचित्र",
      show:  "प्रदर्शन",
      year:  "साल",
      trailer:  "ट्रेलर",
      my_list:  "मेरी सूची",
      like:  "पसंद",
      dislike:  "नापसन्द",
      share:  "साझा करें",
      genres:  "शैलियां",
      recommendation:  "सिफ़ारिश करना",
      create:  "सर्जन करना",
      login:  "लॉग इन करें",
      signup:  "साइन अप करें",
      signupSM:  "साइन अप करें",
      welcome_back:  "वापसी पर स्वागत है",
      forget_password:  "पासवर्ड भूल गए",
      create_account:  "अपने खाते बनाएँ",
      continue:  "जारी रहना",
      email:  "ईमेल",
      password:  "पारण शब्द",
      re_password:  "पासवर्ड फिर से दर्ज करें",
      username:  "उपयोगकर्ता नाम",
      current_password:  "आप वर्तमान पासवर्ड",
      notItemsInCollection:  "इस संग्रह में कोई फिल्म या शो नहीं है",
      noList:  "कोई सूची नहीं है।",
      add_new_collection:  "नए संग्रह में जोड़ें",
      disable:  "अक्षम",
      resolution:  "संकल्प",
      subtitle:  "उपशीर्षक",
      loading:  "लोड हो रहा है",
      ok:  "ठीक",
      live:  "जीना",
      settings:  "सेटिंग्स",
      profile:  "प्रोफाइल",
      security:  "सुरक्षा",
      device_activity:  "डिवाइस गतिविधि",
      history_watch:  "इतिहास देखें",
      update:  "अद्यतन करें"
    },

    sw: {

     nav_home:  "HEM",
     nav_movies:  "filmer",
     nav_show:  "VISAR",
     nav_kids:  "UNGAR",
     nav_tv:  "LIVE TV",
     nav_logout:  "LOGGA UT",
     recently_watch:  "Nyligen titta",
     noItems:  "Det finns inga filmer och tv-serier",
     find_what:  "Hitta vad du ska titta på nästa.",
     search_for:  "Sök efter visar och filmer eller skådespelare",
     actors:  "skådespelare",
     shows_and_movie:  "TV Show & Movies",
     movie:  "Film",
     show:  "Show",
     year:  "År",
     trailer:  "Trailer",
     my_list:  "Min lista",
     like:  "Tycka om",
     dislike:  "Motvilja",
     share:  "Dela med sig",
     genres:  "Genres",
     recommendation:  "Rekommendation",
     create:  "Skapa",
     login:  "LOGGA IN",
     signup:  "BLI MEDLEM",
     signupSM:  "Bli Medlem",
     welcome_back:  "Välkommen tillbaka",
     forget_password:  "Glöm lösenord",
     create_account:  "Skapa ditt konto",
     continue:  "FORTSÄTTA",
     email:  "E-post",
     password:  "Lösenord",
     re_password:  "Skriv lösenordet igen",
     username:  "Användarnamn",
     current_password:  "Ditt nuvarande lösenord",
     notItemsInCollection:  "Det finns inga filmer eller program i denna samling",
     noList:  "Det finns ingen lista.",
     add_new_collection:  "Lägg till i ny samling",
     disable:  "Inaktivera",
     resolution:  "Upplösning",
     subtitle:  "texta",
     loading:  "Läser in",
     ok:  "OK",
     live:  "Leva",
     settings:  "Inställningar",
     profile:  "Profil",
     security:  "Säkerhet",
     device_activity:  "Enhetsaktivitet",
     history_watch:  "History Watch",
     update:  "UPPDATERING"

    },

    jp: {

      nav_home:  "宅",
      nav_movies:  "映画",
      nav_show:  "ショー",
      nav_kids:  "子供",
      nav_tv:  "LIVE TV",
      nav_logout:  "ログアウト",
      recently_watch:  "最近の時計",
      noItems:  "映画やテレビシリーズはありません",
      find_what:  "次に何を見るべきか見つけなさい",
      search_for:  "番組や映画や俳優を検索する",
      actors:  "俳優",
      shows_and_movie:  "テレビ番組＆映画",
      movie:  "映画",
      show:  "見せる",
      year:  "年",
      trailer:  "トレーラー",
      my_list:  "私のリスト",
      like:  "好き",
      dislike:  "嫌い",
      share:  "シェア",
      genres:  "ジャンル",
      recommendation:  "勧告",
      create:  "作成",
      login:  "ログイン",
      signup:  "サインアップ",
      signupSM:  "サインアップ",
      welcome_back:  "お帰りなさい",
      forget_password:  "パスワードを忘れた",
      create_account:  "アカウントを作成",
      continue:  "持続する",
      email:  "Eメール",
      password:  "パスワード",
      re_password:  "パスワード再入力",
      username:  "ユーザー名",
      current_password:  "あなたは現在のパスワード",
      notItemsInCollection:  "このコレクションには映画やショーはありません。",
      noList:  "リストはありません。",
      add_new_collection:  "新しいコレクションに追加",
      disable:  "無効にする",
      resolution:  "解決",
      subtitle:  "字幕",
      loading:  "読み込み中",
      ok:  "よし",
      live:  "ライブ",
      settings:  "設定",
      profile:  "プロフィール",
      security:  "セキュリティ",
      device_activity:  "デバイスアクティビティ",
      history_watch:  "歴史ウォッチ",
      update:  "更新"
    }

    });


export default lang;