import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import * as Localization from 'expo-localization';
import SourceSection from './components/SourceSection';
import ResultSection from './components/ResultSection';
import Logo from './components/Logo';

const languageList = [
    { name: 'العربية', engName: 'Arabic', code: 'SA', langCode: 'ar' },
    { name: 'Bahasa indonesia', engName: 'Indonesian', code: 'ID', langCode: 'id' },
    { name: 'български език', engName: 'Bulgarian', code: 'BG', langCode: 'bg' },
    { name: 'Český', engName: 'Czech', code: 'CZ', langCode: 'cs' },
    { name: 'Dansk', engName: 'Danish', code: 'DK', langCode: 'da' },
    { name: 'Deutsch', engName: 'German', code: 'DE', langCode: 'de' },
    { name: 'English', engName: 'English', code: 'US', langCode: 'en' },
    { name: 'Español', engName: 'Spanish', code: 'ES', langCode: 'es' },
    { name: 'Français', engName: 'French', code: 'FR', langCode: 'fr' },
    { name: 'ελληνικά', engName: 'Greek', code: 'GR', langCode: 'el' },
    { name: 'עִבְרִית', engName: 'Hebrew', code: 'IL', langCode: 'he' },
    { name: 'हिन्दी', engName: 'Hindi', code: 'IN', langCode: 'hi' },
    { name: 'Magyar', engName: 'Hungarian', code: 'HU', langCode: 'hu' },
    { name: 'Italiano', engName: 'Italian', code: 'IT', langCode: 'it' },
    { name: '日本語', engName: 'Japanese', code: 'JP', langCode: 'ja' },
    { name: '조선말', engName: 'Korean', code: 'KR', langCode: 'ko' },
    { name: '普通话 (CN)', engName: 'Mandarin (CN)', code: 'CN', langCode: 'zh' },
    { name: '普通话 (TW)', engName: 'Mandarin (TW)', code: 'TW', langCode: 'zh' },
    { name: 'Nederlands', engName: 'Dutch', code: 'NL', langCode: 'nl' },
    { name: 'Norsk', engName: 'Norwegian', code: 'NO', langCode: 'no' },
    { name: 'فارسی', engName: 'Persian', code: 'IR', langCode: 'fa' },
    { name: 'Polski', engName: 'Polish', code: 'PL', langCode: 'pl' },
    { name: 'Português (BR)', engName: 'Portuguese (BR)', code: 'BR', langCode: 'pt' },
    { name: 'Português (PT)', engName: 'Portuguese (PT)', code: 'PT', langCode: 'pt' },
    { name: 'Română', engName: 'Romanian', code: 'RO', langCode: 'ro' },
    { name: 'Pусский', engName: 'Russian', code: 'RU', langCode: 'ru' },
    { name: 'Suomi', engName: 'Finnish', code: 'FI', langCode: 'fi' },
    { name: 'Svenska', engName: 'Swedish', code: 'SE', langCode: 'sv' },
    { name: 'ภาษาไทย', engName: 'Thai', code: 'TH', langCode: 'th' },
    { name: 'Tiếng Việt', engName: 'Vietnamese', code: 'VN', langCode: 'vi' },
    { name: 'Türkçe', engName: 'Turkish', code: 'TR', langCode: 'tr' },
    { name: 'Український', engName: 'Ukrainian', code: 'UA', langCode: 'uk' },
];

const translations = {
    SA: { title: ['مترجم', 'عناوين الأفلام'], placeholder: 'ابحث عن فيلم', selectLanguage: 'اختر اللغة', noPoster: 'لا يوجد ملصق', searching: 'جاري البحث...', noMovieFound: 'لم يتم العثور على فيلم', noTitleFound: 'لم يتم العثور على عنوان' },
    ID: { title: ['PENERJEMAH', 'JUDUL FILM'], placeholder: 'cari film', selectLanguage: 'Pilih Bahasa', noPoster: 'Tidak ada poster', searching: 'mencari...', noMovieFound: 'Film tidak ditemukan', noTitleFound: 'Judul tidak ditemukan' },
    BG: { title: ['ПРЕВОДАЧ НА', 'ФИЛМОВИ ЗАГЛАВИЯ'], placeholder: 'търсене на филм', selectLanguage: 'Изберете език', noPoster: 'Няма плакат', searching: 'търсене...', noMovieFound: 'Няма намерен филм', noTitleFound: 'Няма намерено заглавие' },
    CZ: { title: ['PŘEKLADAČ', 'FILMOVÝCH NÁZVŮ'], placeholder: 'hledat film', selectLanguage: 'Vyberte jazyk', noPoster: 'Žádný plakát', searching: 'hledání...', noMovieFound: 'Film nenalezen', noTitleFound: 'Název nenalezen' },
    DK: { title: ['FILMTITEL', 'OVERSÆTTER'], placeholder: 'søg efter en film', selectLanguage: 'Vælg sprog', noPoster: 'Ingen plakat', searching: 'søger...', noMovieFound: 'Ingen film fundet', noTitleFound: 'Ingen titel fundet' },
    DE: { title: ['FILMTITEL', 'ÜBERSETZER'], placeholder: 'Film suchen', selectLanguage: 'Sprache wählen', noPoster: 'Kein Poster', searching: 'suche...', noMovieFound: 'Kein Film gefunden', noTitleFound: 'Kein Titel gefunden' },
    US: { title: ['MOVIE TITLE', 'TRANSLATOR'], placeholder: 'search for a movie', selectLanguage: 'Select Language', noPoster: 'No poster', searching: 'searching...', noMovieFound: 'No movie found', noTitleFound: 'No title found' },
    ES: { title: ['TRADUCTOR DE', 'TÍTULOS DE PELÍCULAS'], placeholder: 'buscar una película', selectLanguage: 'Seleccionar idioma', noPoster: 'Sin póster', searching: 'buscando...', noMovieFound: 'Película no encontrada', noTitleFound: 'Título no encontrado' },
    FR: { title: ['TRADUCTEUR DE', 'TITRES DE FILMS'], placeholder: 'rechercher un film', selectLanguage: 'Choisir la langue', noPoster: 'Pas d\'affiche', searching: 'recherche...', noMovieFound: 'Aucun film trouvé', noTitleFound: 'Aucun titre trouvé' },
    GR: { title: ['ΜΕΤΑΦΡΑΣΤΗΣ', 'ΤΙΤΛΩΝ ΤΑΙΝΙΩΝ'], placeholder: 'αναζήτηση ταινίας', selectLanguage: 'Επιλέξτε γλώσσα', noPoster: 'Χωρίς αφίσα', searching: 'αναζήτηση...', noMovieFound: 'Δεν βρέθηκε ταινία', noTitleFound: 'Δεν βρέθηκε τίτλος' },
    IL: { title: ['מתרגם', 'כותרות סרטים'], placeholder: 'חפש סרט', selectLanguage: 'בחר שפה', noPoster: 'אין פוסטר', searching: 'מחפש...', noMovieFound: 'לא נמצא סרט', noTitleFound: 'לא נמצאה כותרת' },
    IN: { title: ['फ़िल्म शीर्षक', 'अनुवादक'], placeholder: 'फ़िल्म खोजें', selectLanguage: 'भाषा चुनें', noPoster: 'कोई पोस्टर नहीं', searching: 'खोज रहा है...', noMovieFound: 'कोई फ़िल्म नहीं मिली', noTitleFound: 'कोई शीर्षक नहीं मिला' },
    HU: { title: ['FILMCÍM', 'FORDÍTÓ'], placeholder: 'film keresése', selectLanguage: 'Nyelv kiválasztása', noPoster: 'Nincs poszter', searching: 'keresés...', noMovieFound: 'Nem található film', noTitleFound: 'Nem található cím' },
    IT: { title: ['TRADUTTORE DI', 'TITOLI DI FILM'], placeholder: 'cerca un film', selectLanguage: 'Seleziona lingua', noPoster: 'Nessun poster', searching: 'ricerca...', noMovieFound: 'Nessun film trovato', noTitleFound: 'Nessun titolo trovato' },
    JP: { title: ['映画タイトル', '翻訳'], placeholder: '映画を検索', selectLanguage: '言語を選択', noPoster: 'ポスターなし', searching: '検索中...', noMovieFound: '映画が見つかりません', noTitleFound: 'タイトルが見つかりません' },
    KR: { title: ['영화 제목', '번역기'], placeholder: '영화 검색', selectLanguage: '언어 선택', noPoster: '포스터 없음', searching: '검색 중...', noMovieFound: '영화를 찾을 수 없습니다', noTitleFound: '제목을 찾을 수 없습니다' },
    CN: { title: ['电影标题', '翻译器'], placeholder: '搜索电影', selectLanguage: '选择语言', noPoster: '无海报', searching: '搜索中...', noMovieFound: '未找到电影', noTitleFound: '未找到标题' },
    TW: { title: ['電影標題', '翻譯器'], placeholder: '搜尋電影', selectLanguage: '選擇語言', noPoster: '無海報', searching: '搜尋中...', noMovieFound: '找不到電影', noTitleFound: '找不到標題' },
    NL: { title: ['FILMTITEL', 'VERTALER'], placeholder: 'zoek een film', selectLanguage: 'Selecteer taal', noPoster: 'Geen poster', searching: 'zoeken...', noMovieFound: 'Geen film gevonden', noTitleFound: 'Geen titel gevonden' },
    NO: { title: ['FILMTITTEL', 'OVERSETTER'], placeholder: 'søk etter en film', selectLanguage: 'Velg språk', noPoster: 'Ingen plakat', searching: 'søker...', noMovieFound: 'Ingen film funnet', noTitleFound: 'Ingen tittel funnet' },
    IR: { title: ['مترجم', 'عنوان فیلم'], placeholder: 'جستجوی فیلم', selectLanguage: 'انتخاب زبان', noPoster: 'بدون پوستر', searching: 'در حال جستجو...', noMovieFound: 'فیلمی یافت نشد', noTitleFound: 'عنوانی یافت نشد' },
    PL: { title: ['TŁUMACZ', 'TYTUŁÓW FILMÓW'], placeholder: 'szukaj filmu', selectLanguage: 'Wybierz język', noPoster: 'Brak plakatu', searching: 'szukanie...', noMovieFound: 'Nie znaleziono filmu', noTitleFound: 'Nie znaleziono tytułu' },
    BR: { title: ['TRADUTOR DE', 'TÍTULOS DE FILMES'], placeholder: 'pesquisar um filme', selectLanguage: 'Selecionar idioma', noPoster: 'Sem pôster', searching: 'pesquisando...', noMovieFound: 'Filme não encontrado', noTitleFound: 'Título não encontrado' },
    PT: { title: ['TRADUTOR DE', 'TÍTULOS DE FILMES'], placeholder: 'pesquisar um filme', selectLanguage: 'Selecionar idioma', noPoster: 'Sem cartaz', searching: 'a pesquisar...', noMovieFound: 'Filme não encontrado', noTitleFound: 'Título não encontrado' },
    RO: { title: ['TRADUCĂTOR DE', 'TITLURI DE FILME'], placeholder: 'caută un film', selectLanguage: 'Selectează limba', noPoster: 'Fără poster', searching: 'căutare...', noMovieFound: 'Niciun film găsit', noTitleFound: 'Niciun titlu găsit' },
    RU: { title: ['ПЕРЕВОДЧИК', 'НАЗВАНИЙ ФИЛЬМОВ'], placeholder: 'поиск фильма', selectLanguage: 'Выберите язык', noPoster: 'Нет постера', searching: 'поиск...', noMovieFound: 'Фильм не найден', noTitleFound: 'Название не найдено' },
    FI: { title: ['ELOKUVAN NIMEN', 'KÄÄNTÄJÄ'], placeholder: 'etsi elokuvaa', selectLanguage: 'Valitse kieli', noPoster: 'Ei julistetta', searching: 'haetaan...', noMovieFound: 'Elokuvaa ei löytynyt', noTitleFound: 'Nimikettä ei löytynyt' },
    SE: { title: ['FILMTITEL', 'ÖVERSÄTTARE'], placeholder: 'sök efter en film', selectLanguage: 'Välj språk', noPoster: 'Ingen affisch', searching: 'söker...', noMovieFound: 'Ingen film hittades', noTitleFound: 'Ingen titel hittades' },
    TH: { title: ['แปลชื่อ', 'ภาพยนตร์'], placeholder: 'ค้นหาภาพยนตร์', selectLanguage: 'เลือกภาษา', noPoster: 'ไม่มีโปสเตอร์', searching: 'กำลังค้นหา...', noMovieFound: 'ไม่พบภาพยนตร์', noTitleFound: 'ไม่พบชื่อเรื่อง' },
    VN: { title: ['DỊCH TÊN', 'PHIM'], placeholder: 'tìm kiếm phim', selectLanguage: 'Chọn ngôn ngữ', noPoster: 'Không có poster', searching: 'đang tìm...', noMovieFound: 'Không tìm thấy phim', noTitleFound: 'Không tìm thấy tiêu đề' },
    TR: { title: ['FİLM BAŞLIĞI', 'ÇEVİRMEN'], placeholder: 'film ara', selectLanguage: 'Dil seçin', noPoster: 'Afiş yok', searching: 'aranıyor...', noMovieFound: 'Film bulunamadı', noTitleFound: 'Başlık bulunamadı' },
    UA: { title: ['ПЕРЕКЛАДАЧ', 'НАЗВ ФІЛЬМІВ'], placeholder: 'шукати фільм', selectLanguage: 'Виберіть мову', noPoster: 'Немає постера', searching: 'пошук...', noMovieFound: 'Фільм не знайдено', noTitleFound: 'Назву не знайдено' },
};

// Language names in each supported language
const languageNames = {
    US: { SA: 'Arabic', ID: 'Indonesian', BG: 'Bulgarian', CZ: 'Czech', DK: 'Danish', DE: 'German', US: 'English', ES: 'Spanish', FR: 'French', GR: 'Greek', IL: 'Hebrew', IN: 'Hindi', HU: 'Hungarian', IT: 'Italian', JP: 'Japanese', KR: 'Korean', CN: 'Mandarin (CN)', TW: 'Mandarin (TW)', NL: 'Dutch', NO: 'Norwegian', IR: 'Persian', PL: 'Polish', BR: 'Portuguese (BR)', PT: 'Portuguese (PT)', RO: 'Romanian', RU: 'Russian', FI: 'Finnish', SE: 'Swedish', TH: 'Thai', VN: 'Vietnamese', TR: 'Turkish', UA: 'Ukrainian' },
    SA: { SA: 'العربية', ID: 'الإندونيسية', BG: 'البلغارية', CZ: 'التشيكية', DK: 'الدنماركية', DE: 'الألمانية', US: 'الإنجليزية', ES: 'الإسبانية', FR: 'الفرنسية', GR: 'اليونانية', IL: 'العبرية', IN: 'الهندية', HU: 'المجرية', IT: 'الإيطالية', JP: 'اليابانية', KR: 'الكورية', CN: 'الماندرين (CN)', TW: 'الماندرين (TW)', NL: 'الهولندية', NO: 'النرويجية', IR: 'الفارسية', PL: 'البولندية', BR: 'البرتغالية (BR)', PT: 'البرتغالية (PT)', RO: 'الرومانية', RU: 'الروسية', FI: 'الفنلندية', SE: 'السويدية', TH: 'التايلاندية', VN: 'الفيتنامية', TR: 'التركية', UA: 'الأوكرانية' },
    ID: { SA: 'Arab', ID: 'Indonesia', BG: 'Bulgaria', CZ: 'Ceko', DK: 'Denmark', DE: 'Jerman', US: 'Inggris', ES: 'Spanyol', FR: 'Prancis', GR: 'Yunani', IL: 'Ibrani', IN: 'Hindi', HU: 'Hungaria', IT: 'Italia', JP: 'Jepang', KR: 'Korea', CN: 'Mandarin (CN)', TW: 'Mandarin (TW)', NL: 'Belanda', NO: 'Norwegia', IR: 'Persia', PL: 'Polandia', BR: 'Portugis (BR)', PT: 'Portugis (PT)', RO: 'Rumania', RU: 'Rusia', FI: 'Finlandia', SE: 'Swedia', TH: 'Thailand', VN: 'Vietnam', TR: 'Turki', UA: 'Ukraina' },
    BG: { SA: 'Арабски', ID: 'Индонезийски', BG: 'Български', CZ: 'Чешки', DK: 'Датски', DE: 'Немски', US: 'Английски', ES: 'Испански', FR: 'Френски', GR: 'Гръцки', IL: 'Иврит', IN: 'Хинди', HU: 'Унгарски', IT: 'Италиански', JP: 'Японски', KR: 'Корейски', CN: 'Мандарин (CN)', TW: 'Мандарин (TW)', NL: 'Нидерландски', NO: 'Норвежки', IR: 'Персийски', PL: 'Полски', BR: 'Португалски (BR)', PT: 'Португалски (PT)', RO: 'Румънски', RU: 'Руски', FI: 'Фински', SE: 'Шведски', TH: 'Тайландски', VN: 'Виетнамски', TR: 'Турски', UA: 'Украински' },
    CZ: { SA: 'Arabština', ID: 'Indonéština', BG: 'Bulharština', CZ: 'Čeština', DK: 'Dánština', DE: 'Němčina', US: 'Angličtina', ES: 'Španělština', FR: 'Francouzština', GR: 'Řečtina', IL: 'Hebrejština', IN: 'Hindština', HU: 'Maďarština', IT: 'Italština', JP: 'Japonština', KR: 'Korejština', CN: 'Mandarínština (CN)', TW: 'Mandarínština (TW)', NL: 'Nizozemština', NO: 'Norština', IR: 'Perština', PL: 'Polština', BR: 'Portugalština (BR)', PT: 'Portugalština (PT)', RO: 'Rumunština', RU: 'Ruština', FI: 'Finština', SE: 'Švédština', TH: 'Thajština', VN: 'Vietnamština', TR: 'Turečtina', UA: 'Ukrajinština' },
    DK: { SA: 'Arabisk', ID: 'Indonesisk', BG: 'Bulgarsk', CZ: 'Tjekkisk', DK: 'Dansk', DE: 'Tysk', US: 'Engelsk', ES: 'Spansk', FR: 'Fransk', GR: 'Græsk', IL: 'Hebraisk', IN: 'Hindi', HU: 'Ungarsk', IT: 'Italiensk', JP: 'Japansk', KR: 'Koreansk', CN: 'Mandarin (CN)', TW: 'Mandarin (TW)', NL: 'Hollandsk', NO: 'Norsk', IR: 'Persisk', PL: 'Polsk', BR: 'Portugisisk (BR)', PT: 'Portugisisk (PT)', RO: 'Rumænsk', RU: 'Russisk', FI: 'Finsk', SE: 'Svensk', TH: 'Thailandsk', VN: 'Vietnamesisk', TR: 'Tyrkisk', UA: 'Ukrainsk' },
    DE: { SA: 'Arabisch', ID: 'Indonesisch', BG: 'Bulgarisch', CZ: 'Tschechisch', DK: 'Dänisch', DE: 'Deutsch', US: 'Englisch', ES: 'Spanisch', FR: 'Französisch', GR: 'Griechisch', IL: 'Hebräisch', IN: 'Hindi', HU: 'Ungarisch', IT: 'Italienisch', JP: 'Japanisch', KR: 'Koreanisch', CN: 'Mandarin (CN)', TW: 'Mandarin (TW)', NL: 'Niederländisch', NO: 'Norwegisch', IR: 'Persisch', PL: 'Polnisch', BR: 'Portugiesisch (BR)', PT: 'Portugiesisch (PT)', RO: 'Rumänisch', RU: 'Russisch', FI: 'Finnisch', SE: 'Schwedisch', TH: 'Thailändisch', VN: 'Vietnamesisch', TR: 'Türkisch', UA: 'Ukrainisch' },
    ES: { SA: 'Árabe', ID: 'Indonesio', BG: 'Búlgaro', CZ: 'Checo', DK: 'Danés', DE: 'Alemán', US: 'Inglés', ES: 'Español', FR: 'Francés', GR: 'Griego', IL: 'Hebreo', IN: 'Hindi', HU: 'Húngaro', IT: 'Italiano', JP: 'Japonés', KR: 'Coreano', CN: 'Mandarín (CN)', TW: 'Mandarín (TW)', NL: 'Neerlandés', NO: 'Noruego', IR: 'Persa', PL: 'Polaco', BR: 'Portugués (BR)', PT: 'Portugués (PT)', RO: 'Rumano', RU: 'Ruso', FI: 'Finlandés', SE: 'Sueco', TH: 'Tailandés', VN: 'Vietnamita', TR: 'Turco', UA: 'Ucraniano' },
    FR: { SA: 'Arabe', ID: 'Indonésien', BG: 'Bulgare', CZ: 'Tchèque', DK: 'Danois', DE: 'Allemand', US: 'Anglais', ES: 'Espagnol', FR: 'Français', GR: 'Grec', IL: 'Hébreu', IN: 'Hindi', HU: 'Hongrois', IT: 'Italien', JP: 'Japonais', KR: 'Coréen', CN: 'Mandarin (CN)', TW: 'Mandarin (TW)', NL: 'Néerlandais', NO: 'Norvégien', IR: 'Persan', PL: 'Polonais', BR: 'Portugais (BR)', PT: 'Portugais (PT)', RO: 'Roumain', RU: 'Russe', FI: 'Finnois', SE: 'Suédois', TH: 'Thaï', VN: 'Vietnamien', TR: 'Turc', UA: 'Ukrainien' },
    GR: { SA: 'Αραβικά', ID: 'Ινδονησιακά', BG: 'Βουλγαρικά', CZ: 'Τσεχικά', DK: 'Δανικά', DE: 'Γερμανικά', US: 'Αγγλικά', ES: 'Ισπανικά', FR: 'Γαλλικά', GR: 'Ελληνικά', IL: 'Εβραϊκά', IN: 'Χίντι', HU: 'Ουγγρικά', IT: 'Ιταλικά', JP: 'Ιαπωνικά', KR: 'Κορεατικά', CN: 'Μανδαρινικά (CN)', TW: 'Μανδαρινικά (TW)', NL: 'Ολλανδικά', NO: 'Νορβηγικά', IR: 'Περσικά', PL: 'Πολωνικά', BR: 'Πορτογαλικά (BR)', PT: 'Πορτογαλικά (PT)', RO: 'Ρουμανικά', RU: 'Ρωσικά', FI: 'Φινλανδικά', SE: 'Σουηδικά', TH: 'Ταϊλανδέζικα', VN: 'Βιετναμέζικα', TR: 'Τουρκικά', UA: 'Ουκρανικά' },
    IL: { SA: 'ערבית', ID: 'אינדונזית', BG: 'בולגרית', CZ: 'צ׳כית', DK: 'דנית', DE: 'גרמנית', US: 'אנגלית', ES: 'ספרדית', FR: 'צרפתית', GR: 'יוונית', IL: 'עברית', IN: 'הינדי', HU: 'הונגרית', IT: 'איטלקית', JP: 'יפנית', KR: 'קוריאנית', CN: 'מנדרינית (CN)', TW: 'מנדרינית (TW)', NL: 'הולנדית', NO: 'נורווגית', IR: 'פרסית', PL: 'פולנית', BR: 'פורטוגזית (BR)', PT: 'פורטוגזית (PT)', RO: 'רומנית', RU: 'רוסית', FI: 'פינית', SE: 'שוודית', TH: 'תאילנדית', VN: 'וייטנאמית', TR: 'טורקית', UA: 'אוקראינית' },
    IN: { SA: 'अरबी', ID: 'इंडोनेशियाई', BG: 'बल्गेरियाई', CZ: 'चेक', DK: 'डेनिश', DE: 'जर्मन', US: 'अंग्रेज़ी', ES: 'स्पेनिश', FR: 'फ़्रेंच', GR: 'यूनानी', IL: 'हिब्रू', IN: 'हिन्दी', HU: 'हंगेरियन', IT: 'इतालवी', JP: 'जापानी', KR: 'कोरियाई', CN: 'मंदारिन (CN)', TW: 'मंदारिन (TW)', NL: 'डच', NO: 'नॉर्वेजियन', IR: 'फ़ारसी', PL: 'पोलिश', BR: 'पुर्तगाली (BR)', PT: 'पुर्तगाली (PT)', RO: 'रोमानियाई', RU: 'रूसी', FI: 'फ़िनिश', SE: 'स्वीडिश', TH: 'थाई', VN: 'वियतनामी', TR: 'तुर्की', UA: 'यूक्रेनी' },
    HU: { SA: 'Arab', ID: 'Indonéz', BG: 'Bolgár', CZ: 'Cseh', DK: 'Dán', DE: 'Német', US: 'Angol', ES: 'Spanyol', FR: 'Francia', GR: 'Görög', IL: 'Héber', IN: 'Hindi', HU: 'Magyar', IT: 'Olasz', JP: 'Japán', KR: 'Koreai', CN: 'Mandarin (CN)', TW: 'Mandarin (TW)', NL: 'Holland', NO: 'Norvég', IR: 'Perzsa', PL: 'Lengyel', BR: 'Portugál (BR)', PT: 'Portugál (PT)', RO: 'Román', RU: 'Orosz', FI: 'Finn', SE: 'Svéd', TH: 'Thai', VN: 'Vietnámi', TR: 'Török', UA: 'Ukrán' },
    IT: { SA: 'Arabo', ID: 'Indonesiano', BG: 'Bulgaro', CZ: 'Ceco', DK: 'Danese', DE: 'Tedesco', US: 'Inglese', ES: 'Spagnolo', FR: 'Francese', GR: 'Greco', IL: 'Ebraico', IN: 'Hindi', HU: 'Ungherese', IT: 'Italiano', JP: 'Giapponese', KR: 'Coreano', CN: 'Mandarino (CN)', TW: 'Mandarino (TW)', NL: 'Olandese', NO: 'Norvegese', IR: 'Persiano', PL: 'Polacco', BR: 'Portoghese (BR)', PT: 'Portoghese (PT)', RO: 'Rumeno', RU: 'Russo', FI: 'Finlandese', SE: 'Svedese', TH: 'Tailandese', VN: 'Vietnamita', TR: 'Turco', UA: 'Ucraino' },
    JP: { SA: 'アラビア語', ID: 'インドネシア語', BG: 'ブルガリア語', CZ: 'チェコ語', DK: 'デンマーク語', DE: 'ドイツ語', US: '英語', ES: 'スペイン語', FR: 'フランス語', GR: 'ギリシャ語', IL: 'ヘブライ語', IN: 'ヒンディー語', HU: 'ハンガリー語', IT: 'イタリア語', JP: '日本語', KR: '韓国語', CN: '中国語 (CN)', TW: '中国語 (TW)', NL: 'オランダ語', NO: 'ノルウェー語', IR: 'ペルシア語', PL: 'ポーランド語', BR: 'ポルトガル語 (BR)', PT: 'ポルトガル語 (PT)', RO: 'ルーマニア語', RU: 'ロシア語', FI: 'フィンランド語', SE: 'スウェーデン語', TH: 'タイ語', VN: 'ベトナム語', TR: 'トルコ語', UA: 'ウクライナ語' },
    KR: { SA: '아랍어', ID: '인도네시아어', BG: '불가리아어', CZ: '체코어', DK: '덴마크어', DE: '독일어', US: '영어', ES: '스페인어', FR: '프랑스어', GR: '그리스어', IL: '히브리어', IN: '힌디어', HU: '헝가리어', IT: '이탈리아어', JP: '일본어', KR: '한국어', CN: '중국어 (CN)', TW: '중국어 (TW)', NL: '네덜란드어', NO: '노르웨이어', IR: '페르시아어', PL: '폴란드어', BR: '포르투갈어 (BR)', PT: '포르투갈어 (PT)', RO: '루마니아어', RU: '러시아어', FI: '핀란드어', SE: '스웨덴어', TH: '태국어', VN: '베트남어', TR: '터키어', UA: '우크라이나어' },
    CN: { SA: '阿拉伯语', ID: '印尼语', BG: '保加利亚语', CZ: '捷克语', DK: '丹麦语', DE: '德语', US: '英语', ES: '西班牙语', FR: '法语', GR: '希腊语', IL: '希伯来语', IN: '印地语', HU: '匈牙利语', IT: '意大利语', JP: '日语', KR: '韩语', CN: '普通话 (CN)', TW: '普通话 (TW)', NL: '荷兰语', NO: '挪威语', IR: '波斯语', PL: '波兰语', BR: '葡萄牙语 (BR)', PT: '葡萄牙语 (PT)', RO: '罗马尼亚语', RU: '俄语', FI: '芬兰语', SE: '瑞典语', TH: '泰语', VN: '越南语', TR: '土耳其语', UA: '乌克兰语' },
    TW: { SA: '阿拉伯語', ID: '印尼語', BG: '保加利亞語', CZ: '捷克語', DK: '丹麥語', DE: '德語', US: '英語', ES: '西班牙語', FR: '法語', GR: '希臘語', IL: '希伯來語', IN: '印地語', HU: '匈牙利語', IT: '義大利語', JP: '日語', KR: '韓語', CN: '普通話 (CN)', TW: '普通話 (TW)', NL: '荷蘭語', NO: '挪威語', IR: '波斯語', PL: '波蘭語', BR: '葡萄牙語 (BR)', PT: '葡萄牙語 (PT)', RO: '羅馬尼亞語', RU: '俄語', FI: '芬蘭語', SE: '瑞典語', TH: '泰語', VN: '越南語', TR: '土耳其語', UA: '烏克蘭語' },
    NL: { SA: 'Arabisch', ID: 'Indonesisch', BG: 'Bulgaars', CZ: 'Tsjechisch', DK: 'Deens', DE: 'Duits', US: 'Engels', ES: 'Spaans', FR: 'Frans', GR: 'Grieks', IL: 'Hebreeuws', IN: 'Hindi', HU: 'Hongaars', IT: 'Italiaans', JP: 'Japans', KR: 'Koreaans', CN: 'Mandarijn (CN)', TW: 'Mandarijn (TW)', NL: 'Nederlands', NO: 'Noors', IR: 'Perzisch', PL: 'Pools', BR: 'Portugees (BR)', PT: 'Portugees (PT)', RO: 'Roemeens', RU: 'Russisch', FI: 'Fins', SE: 'Zweeds', TH: 'Thais', VN: 'Vietnamees', TR: 'Turks', UA: 'Oekraïens' },
    NO: { SA: 'Arabisk', ID: 'Indonesisk', BG: 'Bulgarsk', CZ: 'Tsjekkisk', DK: 'Dansk', DE: 'Tysk', US: 'Engelsk', ES: 'Spansk', FR: 'Fransk', GR: 'Gresk', IL: 'Hebraisk', IN: 'Hindi', HU: 'Ungarsk', IT: 'Italiensk', JP: 'Japansk', KR: 'Koreansk', CN: 'Mandarin (CN)', TW: 'Mandarin (TW)', NL: 'Nederlandsk', NO: 'Norsk', IR: 'Persisk', PL: 'Polsk', BR: 'Portugisisk (BR)', PT: 'Portugisisk (PT)', RO: 'Rumensk', RU: 'Russisk', FI: 'Finsk', SE: 'Svensk', TH: 'Thai', VN: 'Vietnamesisk', TR: 'Tyrkisk', UA: 'Ukrainsk' },
    IR: { SA: 'عربی', ID: 'اندونزیایی', BG: 'بلغاری', CZ: 'چکی', DK: 'دانمارکی', DE: 'آلمانی', US: 'انگلیسی', ES: 'اسپانیایی', FR: 'فرانسوی', GR: 'یونانی', IL: 'عبری', IN: 'هندی', HU: 'مجاری', IT: 'ایتالیایی', JP: 'ژاپنی', KR: 'کره‌ای', CN: 'ماندارین (CN)', TW: 'ماندارین (TW)', NL: 'هلندی', NO: 'نروژی', IR: 'فارسی', PL: 'لهستانی', BR: 'پرتغالی (BR)', PT: 'پرتغالی (PT)', RO: 'رومانیایی', RU: 'روسی', FI: 'فنلاندی', SE: 'سوئدی', TH: 'تایلندی', VN: 'ویتنامی', TR: 'ترکی', UA: 'اوکراینی' },
    PL: { SA: 'Arabski', ID: 'Indonezyjski', BG: 'Bułgarski', CZ: 'Czeski', DK: 'Duński', DE: 'Niemiecki', US: 'Angielski', ES: 'Hiszpański', FR: 'Francuski', GR: 'Grecki', IL: 'Hebrajski', IN: 'Hindi', HU: 'Węgierski', IT: 'Włoski', JP: 'Japoński', KR: 'Koreański', CN: 'Mandaryński (CN)', TW: 'Mandaryński (TW)', NL: 'Niderlandzki', NO: 'Norweski', IR: 'Perski', PL: 'Polski', BR: 'Portugalski (BR)', PT: 'Portugalski (PT)', RO: 'Rumuński', RU: 'Rosyjski', FI: 'Fiński', SE: 'Szwedzki', TH: 'Tajski', VN: 'Wietnamski', TR: 'Turecki', UA: 'Ukraiński' },
    BR: { SA: 'Árabe', ID: 'Indonésio', BG: 'Búlgaro', CZ: 'Tcheco', DK: 'Dinamarquês', DE: 'Alemão', US: 'Inglês', ES: 'Espanhol', FR: 'Francês', GR: 'Grego', IL: 'Hebraico', IN: 'Hindi', HU: 'Húngaro', IT: 'Italiano', JP: 'Japonês', KR: 'Coreano', CN: 'Mandarim (CN)', TW: 'Mandarim (TW)', NL: 'Holandês', NO: 'Norueguês', IR: 'Persa', PL: 'Polonês', BR: 'Português (BR)', PT: 'Português (PT)', RO: 'Romeno', RU: 'Russo', FI: 'Finlandês', SE: 'Sueco', TH: 'Tailandês', VN: 'Vietnamita', TR: 'Turco', UA: 'Ucraniano' },
    PT: { SA: 'Árabe', ID: 'Indonésio', BG: 'Búlgaro', CZ: 'Checo', DK: 'Dinamarquês', DE: 'Alemão', US: 'Inglês', ES: 'Espanhol', FR: 'Francês', GR: 'Grego', IL: 'Hebraico', IN: 'Hindi', HU: 'Húngaro', IT: 'Italiano', JP: 'Japonês', KR: 'Coreano', CN: 'Mandarim (CN)', TW: 'Mandarim (TW)', NL: 'Neerlandês', NO: 'Norueguês', IR: 'Persa', PL: 'Polaco', BR: 'Português (BR)', PT: 'Português (PT)', RO: 'Romeno', RU: 'Russo', FI: 'Finlandês', SE: 'Sueco', TH: 'Tailandês', VN: 'Vietnamita', TR: 'Turco', UA: 'Ucraniano' },
    RO: { SA: 'Arabă', ID: 'Indoneziană', BG: 'Bulgară', CZ: 'Cehă', DK: 'Daneză', DE: 'Germană', US: 'Engleză', ES: 'Spaniolă', FR: 'Franceză', GR: 'Greacă', IL: 'Ebraică', IN: 'Hindi', HU: 'Maghiară', IT: 'Italiană', JP: 'Japoneză', KR: 'Coreeană', CN: 'Mandarină (CN)', TW: 'Mandarină (TW)', NL: 'Olandeză', NO: 'Norvegiană', IR: 'Persană', PL: 'Poloneză', BR: 'Portugheză (BR)', PT: 'Portugheză (PT)', RO: 'Română', RU: 'Rusă', FI: 'Finlandeză', SE: 'Suedeză', TH: 'Thailandeză', VN: 'Vietnameză', TR: 'Turcă', UA: 'Ucraineană' },
    RU: { SA: 'Арабский', ID: 'Индонезийский', BG: 'Болгарский', CZ: 'Чешский', DK: 'Датский', DE: 'Немецкий', US: 'Английский', ES: 'Испанский', FR: 'Французский', GR: 'Греческий', IL: 'Иврит', IN: 'Хинди', HU: 'Венгерский', IT: 'Итальянский', JP: 'Японский', KR: 'Корейский', CN: 'Мандарин (CN)', TW: 'Мандарин (TW)', NL: 'Нидерландский', NO: 'Норвежский', IR: 'Персидский', PL: 'Польский', BR: 'Португальский (BR)', PT: 'Португальский (PT)', RO: 'Румынский', RU: 'Русский', FI: 'Финский', SE: 'Шведский', TH: 'Тайский', VN: 'Вьетнамский', TR: 'Турецкий', UA: 'Украинский' },
    FI: { SA: 'Arabia', ID: 'Indonesia', BG: 'Bulgaria', CZ: 'Tšekki', DK: 'Tanska', DE: 'Saksa', US: 'Englanti', ES: 'Espanja', FR: 'Ranska', GR: 'Kreikka', IL: 'Heprea', IN: 'Hindi', HU: 'Unkari', IT: 'Italia', JP: 'Japani', KR: 'Korea', CN: 'Mandariini (CN)', TW: 'Mandariini (TW)', NL: 'Hollanti', NO: 'Norja', IR: 'Persia', PL: 'Puola', BR: 'Portugali (BR)', PT: 'Portugali (PT)', RO: 'Romania', RU: 'Venäjä', FI: 'Suomi', SE: 'Ruotsi', TH: 'Thai', VN: 'Vietnam', TR: 'Turkki', UA: 'Ukraina' },
    SE: { SA: 'Arabiska', ID: 'Indonesiska', BG: 'Bulgariska', CZ: 'Tjeckiska', DK: 'Danska', DE: 'Tyska', US: 'Engelska', ES: 'Spanska', FR: 'Franska', GR: 'Grekiska', IL: 'Hebreiska', IN: 'Hindi', HU: 'Ungerska', IT: 'Italienska', JP: 'Japanska', KR: 'Koreanska', CN: 'Mandarin (CN)', TW: 'Mandarin (TW)', NL: 'Nederländska', NO: 'Norska', IR: 'Persiska', PL: 'Polska', BR: 'Portugisiska (BR)', PT: 'Portugisiska (PT)', RO: 'Rumänska', RU: 'Ryska', FI: 'Finska', SE: 'Svenska', TH: 'Thailändska', VN: 'Vietnamesiska', TR: 'Turkiska', UA: 'Ukrainska' },
    TH: { SA: 'อาหรับ', ID: 'อินโดนีเซีย', BG: 'บัลแกเรีย', CZ: 'เช็ก', DK: 'เดนมาร์ก', DE: 'เยอรมัน', US: 'อังกฤษ', ES: 'สเปน', FR: 'ฝรั่งเศส', GR: 'กรีก', IL: 'ฮีบรู', IN: 'ฮินดี', HU: 'ฮังการี', IT: 'อิตาลี', JP: 'ญี่ปุ่น', KR: 'เกาหลี', CN: 'จีนกลาง (CN)', TW: 'จีนกลาง (TW)', NL: 'ดัตช์', NO: 'นอร์เวย์', IR: 'เปอร์เซีย', PL: 'โปแลนด์', BR: 'โปรตุเกส (BR)', PT: 'โปรตุเกส (PT)', RO: 'โรมาเนีย', RU: 'รัสเซีย', FI: 'ฟินแลนด์', SE: 'สวีเดน', TH: 'ไทย', VN: 'เวียดนาม', TR: 'ตุรกี', UA: 'ยูเครน' },
    VN: { SA: 'Ả Rập', ID: 'Indonesia', BG: 'Bungari', CZ: 'Séc', DK: 'Đan Mạch', DE: 'Đức', US: 'Anh', ES: 'Tây Ban Nha', FR: 'Pháp', GR: 'Hy Lạp', IL: 'Do Thái', IN: 'Hindi', HU: 'Hungary', IT: 'Ý', JP: 'Nhật', KR: 'Hàn', CN: 'Quan Thoại (CN)', TW: 'Quan Thoại (TW)', NL: 'Hà Lan', NO: 'Na Uy', IR: 'Ba Tư', PL: 'Ba Lan', BR: 'Bồ Đào Nha (BR)', PT: 'Bồ Đào Nha (PT)', RO: 'Romania', RU: 'Nga', FI: 'Phần Lan', SE: 'Thụy Điển', TH: 'Thái', VN: 'Việt', TR: 'Thổ Nhĩ Kỳ', UA: 'Ukraina' },
    TR: { SA: 'Arapça', ID: 'Endonezce', BG: 'Bulgarca', CZ: 'Çekçe', DK: 'Danca', DE: 'Almanca', US: 'İngilizce', ES: 'İspanyolca', FR: 'Fransızca', GR: 'Yunanca', IL: 'İbranice', IN: 'Hintçe', HU: 'Macarca', IT: 'İtalyanca', JP: 'Japonca', KR: 'Korece', CN: 'Mandarin (CN)', TW: 'Mandarin (TW)', NL: 'Felemenkçe', NO: 'Norveççe', IR: 'Farsça', PL: 'Lehçe', BR: 'Portekizce (BR)', PT: 'Portekizce (PT)', RO: 'Rumence', RU: 'Rusça', FI: 'Fince', SE: 'İsveççe', TH: 'Tayca', VN: 'Vietnamca', TR: 'Türkçe', UA: 'Ukraynaca' },
    UA: { SA: 'Арабська', ID: 'Індонезійська', BG: 'Болгарська', CZ: 'Чеська', DK: 'Данська', DE: 'Німецька', US: 'Англійська', ES: 'Іспанська', FR: 'Французька', GR: 'Грецька', IL: 'Іврит', IN: 'Гінді', HU: 'Угорська', IT: 'Італійська', JP: 'Японська', KR: 'Корейська', CN: 'Мандаринська (CN)', TW: 'Мандаринська (TW)', NL: 'Нідерландська', NO: 'Норвезька', IR: 'Перська', PL: 'Польська', BR: 'Португальська (BR)', PT: 'Португальська (PT)', RO: 'Румунська', RU: 'Російська', FI: 'Фінська', SE: 'Шведська', TH: 'Тайська', VN: 'В\'єтнамська', TR: 'Турецька', UA: 'Українська' },
};

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

// Default language fallback
const defaultLanguage = { name: 'English', engName: 'English', code: 'US', langCode: 'en' };

// Get initial language based on device locale
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    const deviceLangCode = locales[0].languageCode;
    const deviceRegion = locales[0].regionCode;

    // Try to find exact match with region (e.g., pt-BR vs pt-PT)
    let match = languageList.find(
      lang => lang.langCode === deviceLangCode && lang.code === deviceRegion
    );

    // If no exact match, try just language code
    if (!match) {
      match = languageList.find(lang => lang.langCode === deviceLangCode);
    }

    return match || defaultLanguage;
  }
  return defaultLanguage;
};

const App = () => {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
  });
  const [loading, setLoading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState(getDeviceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(() => {
    // Set a different default target language than source
    const source = getDeviceLanguage();
    if (source.langCode === 'en') {
      return languageList.find(lang => lang.code === 'JP') || languageList[0];
    }
    return defaultLanguage;
  });
  const [query, setQuery] = useState('');
  const [topHits, setTopHits] = useState([]);
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalYear, setOriginalYear] = useState('');
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [originalPoster, setOriginalPoster] = useState(null);
  const [translatedPoster, setTranslatedPoster] = useState(null);

  const currentTranslation = translations[sourceLanguage.code] || translations.US;
  const deviceLanguage = getDeviceLanguage();

  const handleSourceLanguage = (index) => {
    setSourceLanguage(languageList[index]);
  };

  const handleTargetLanguage = (index) => {
    setTargetLanguage(languageList[index]);
  };

  const handleInput = (text) => {
    setLoading(true);
    setQuery(text);
  };

  // MOVIEDB API
  useEffect(() => {
    if (query === '') {
      setLoading(false);
      setOriginalTitle('');
      setOriginalYear('');
      setTranslatedTitle('');
      setOriginalPoster(null);
      setTranslatedPoster(null);
    } else {
      const searchLanguage = `${sourceLanguage.langCode}-${sourceLanguage.code}`;
      const baseURL =
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=${searchLanguage}&query=`;
      const url = ''.concat(baseURL, query);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (!data.results || data.results.length === 0) {
            setOriginalTitle(currentTranslation.noMovieFound);
            setTranslatedTitle(currentTranslation.noMovieFound);
            setLoading(false);
            return;
          }

          // Setup autocomplete suggestions with year and poster
          setTopHits(data.results.slice(0, 6).map((hit) => ({
            title: hit.title,
            year: hit.release_date ? hit.release_date.substring(0, 4) : '',
            poster: hit.poster_path ? `${TMDB_IMAGE_BASE}${hit.poster_path}` : null,
          })));

          // Use first result
          const movieID = data.results[0].id;
          const altTitleURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${TMDB_API_KEY}&append_to_response=translations`;

          // Fetch images for localized posters
          const imagesURL = `https://api.themoviedb.org/3/movie/${movieID}/images?api_key=${TMDB_API_KEY}&include_image_language=${targetLanguage.langCode},${sourceLanguage.langCode},en,null`;

          // Get translations array from top hit
          fetch(altTitleURL)
            .then((altTitleResponse) => altTitleResponse.json())
            .then((altTitleData) => {
              // Fetch localized posters
              fetch(imagesURL)
                .then((imagesResponse) => imagesResponse.json())
                .then((imagesData) => {
                  // Look for poster in source language
                  const sourcePoster = imagesData.posters?.find(
                    (poster) => poster.iso_639_1 === sourceLanguage.langCode
                  );
                  if (sourcePoster) {
                    setOriginalPoster(`${TMDB_IMAGE_BASE}${sourcePoster.file_path}`);
                  } else if (altTitleData.poster_path) {
                    // Fall back to default poster
                    setOriginalPoster(`${TMDB_IMAGE_BASE}${altTitleData.poster_path}`);
                  } else {
                    setOriginalPoster(null);
                  }

                  // Look for poster in target language
                  const targetPoster = imagesData.posters?.find(
                    (poster) => poster.iso_639_1 === targetLanguage.langCode
                  );
                  if (targetPoster) {
                    setTranslatedPoster(`${TMDB_IMAGE_BASE}${targetPoster.file_path}`);
                  } else if (targetLanguage.langCode === 'en' && altTitleData.poster_path) {
                    // For English, fall back to default poster (usually English)
                    setTranslatedPoster(`${TMDB_IMAGE_BASE}${altTitleData.poster_path}`);
                  } else {
                    setTranslatedPoster(null);
                  }
                })
                .catch(() => {
                  // Fall back to default poster on error
                  if (altTitleData.poster_path) {
                    setOriginalPoster(`${TMDB_IMAGE_BASE}${altTitleData.poster_path}`);
                  } else {
                    setOriginalPoster(null);
                  }
                  setTranslatedPoster(null);
                });

              // Set year from movie data
              setOriginalYear(altTitleData.release_date ? altTitleData.release_date.substring(0, 4) : '');

              // Find source language translation for title
              const sourceTranslation = altTitleData.translations.translations.find(
                (t) => t.iso_3166_1 === sourceLanguage.code
              );
              if (sourceTranslation && sourceTranslation.data.title) {
                setOriginalTitle(sourceTranslation.data.title);
              } else {
                // Fall back to default title from search results (which used source language)
                setOriginalTitle(altTitleData.title);
              }

              // Find translation for target language
              const translation = altTitleData.translations.translations.find(
                (t) => t.iso_3166_1 === targetLanguage.code
              );

              if (translation && translation.data.title) {
                setTranslatedTitle(translation.data.title);
              } else if (targetLanguage.langCode === 'en') {
                // For English, fall back to default title (usually English)
                setTranslatedTitle(altTitleData.title);
              } else {
                setTranslatedTitle(currentTranslation.noTitleFound);
              }
              setLoading(false);
            })
            .catch(() => {
              setOriginalTitle(currentTranslation.noMovieFound);
              setTranslatedTitle(currentTranslation.noMovieFound);
              setLoading(false);
            });
        })
        .catch(() => {
          setOriginalTitle(currentTranslation.noMovieFound);
          setTranslatedTitle(currentTranslation.noMovieFound);
          setLoading(false);
        });
    }
  }, [targetLanguage, sourceLanguage, query, currentTranslation]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#d62b1e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Logo size={90} color="#d62b1e" />
              <View style={styles.titleText}>
                <Text
                  style={styles.mainTitle}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                >
                  {currentTranslation.title[0]}
                </Text>
                <Text
                  style={styles.mainTitle}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                >
                  {currentTranslation.title[1]}
                </Text>
              </View>
            </View>
          </View>

          {/* Source Section */}
          <SourceSection
            language={sourceLanguage}
            languageList={languageList}
            languageNames={languageNames[sourceLanguage.code] || languageNames.US}
            deviceLanguage={deviceLanguage}
            query={query}
            topHits={topHits}
            originalTitle={originalTitle}
            originalYear={originalYear}
            originalPoster={originalPoster}
            loading={loading}
            translations={currentTranslation}
            onLanguageChange={handleSourceLanguage}
            onInput={handleInput}
          />

          {/* Result Section */}
          <ResultSection
            language={targetLanguage}
            languageList={languageList.filter(lang => lang.code !== sourceLanguage.code)}
            languageNames={languageNames[sourceLanguage.code] || languageNames.US}
            translatedTitle={translatedTitle}
            translatedPoster={translatedPoster}
            loading={loading}
            translations={currentTranslation}
            onLanguageChange={(index) => {
              const filteredList = languageList.filter(lang => lang.code !== sourceLanguage.code);
              const selectedLang = filteredList[index];
              const originalIndex = languageList.findIndex(lang => lang.code === selectedLang.code);
              handleTargetLanguage(originalIndex);
            }}
          />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#dbdbd5',
  },
  container: {
    flex: 1,
    backgroundColor: '#dbdbd5',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 15,
  },
  titleSection: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  titleText: {
    flex: 1,
    marginLeft: 12,
  },
  mainTitle: {
    fontFamily: 'BebasNeue_400Regular',
    color: '#d62b1e',
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: 3,
  },
});

export default App;
