import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MESSAGES_DIR = resolve(__dirname, "..", "messages");

const kioskKeys = {
  cs: {
    kiosk_setup__pin__change: "Změnit PIN",
    kiosk__gate__title: "Zadejte PIN kiosku",
    kiosk__gate__hint: "Zadejte 4místný PIN pro otevření kiosku.",
    kiosk__gate__submit: "Otevřít kiosk",
    kiosk__gate__verifying: "Ověřování…",
    kiosk__gate__wrong: "Nesprávný PIN. Zkuste to znovu.",
    kiosk__gate__rate_limited:
      "Příliš mnoho pokusů. Počkejte chvíli a zkuste to znovu.",
    kiosk__share__eyebrow: "Sdílet odkaz na kiosk",
    kiosk__share__desc:
      "Pošlete tento odkaz osobě, která bude kiosk v den akce instalovat. Bude potřebovat PIN k jeho otevření.",
    kiosk__share__copy: "Kopírovat odkaz",
    kiosk__share__copied: "Zkopírováno!",
    kiosk__share__pin_set:
      "Výchozí PIN je 1234. Změňte ho v kartě zamčení před sdílením.",
  },
  da: {
    kiosk_setup__pin__change: "Skift PIN",
    kiosk__gate__title: "Indtast kiosk-PIN",
    kiosk__gate__hint: "Indtast den 4-cifrede PIN for at åbne kiosken.",
    kiosk__gate__submit: "Åbn kiosk",
    kiosk__gate__verifying: "Kontrollerer…",
    kiosk__gate__wrong: "Forkert PIN. Prøv igen.",
    kiosk__gate__rate_limited:
      "For mange forsøg. Vent et øjeblik og prøv igen.",
    kiosk__share__eyebrow: "Del kiosk-linket",
    kiosk__share__desc:
      "Send dette link til den, der opsætter kiosken på dagen. De skal bruge PIN'en for at åbne den.",
    kiosk__share__copy: "Kopier link",
    kiosk__share__copied: "Kopieret!",
    kiosk__share__pin_set:
      "Standard-PIN er 1234. Skift den i låsekortet før deling.",
  },
  de: {
    kiosk_setup__pin__change: "PIN ändern",
    kiosk__gate__title: "Kiosk-PIN eingeben",
    kiosk__gate__hint:
      "Geben Sie die 4-stellige PIN ein, um den Kiosk zu öffnen.",
    kiosk__gate__submit: "Kiosk öffnen",
    kiosk__gate__verifying: "Wird geprüft…",
    kiosk__gate__wrong: "Falsche PIN. Bitte erneut versuchen.",
    kiosk__gate__rate_limited:
      "Zu viele Versuche. Bitte warten Sie einen Moment.",
    kiosk__share__eyebrow: "Kiosk-Link teilen",
    kiosk__share__desc:
      "Senden Sie diesen Link an die Person, die den Kiosk am Tag einrichtet. Sie benötigt die PIN, um ihn zu öffnen.",
    kiosk__share__copy: "Link kopieren",
    kiosk__share__copied: "Kopiert!",
    kiosk__share__pin_set:
      "Standard-PIN ist 1234. Ändern Sie sie in der Lockdown-Karte vor dem Teilen.",
  },
  el: {
    kiosk_setup__pin__change: "Αλλαγή PIN",
    kiosk__gate__title: "Εισαγάγετε το PIN του kiosk",
    kiosk__gate__hint:
      "Πληκτρολογήστε το 4ψήφιο PIN για να ανοίξετε το kiosk.",
    kiosk__gate__submit: "Άνοιγμα kiosk",
    kiosk__gate__verifying: "Επαλήθευση…",
    kiosk__gate__wrong: "Λάθος PIN. Δοκιμάστε ξανά.",
    kiosk__gate__rate_limited:
      "Πάρα πολλές προσπάθειες. Περιμένετε μια στιγμή και δοκιμάστε ξανά.",
    kiosk__share__eyebrow: "Κοινοποίηση συνδέσμου kiosk",
    kiosk__share__desc:
      "Στείλτε αυτόν τον σύνδεσμο σε όποιον θα ρυθμίσει το kiosk την ημέρα. Θα χρειαστεί το PIN για να το ανοίξει.",
    kiosk__share__copy: "Αντιγραφή συνδέσμου",
    kiosk__share__copied: "Αντιγράφηκε!",
    kiosk__share__pin_set:
      "Το προεπιλεγμένο PIN είναι 1234. Αλλάξτε το από την κάρτα κλειδώματος πριν από την κοινοποίηση.",
  },
  es: {
    kiosk_setup__pin__change: "Cambiar PIN",
    kiosk__gate__title: "Introduce el PIN del kiosco",
    kiosk__gate__hint: "Escribe el PIN de 4 dígitos para abrir el kiosco.",
    kiosk__gate__submit: "Abrir kiosco",
    kiosk__gate__verifying: "Comprobando…",
    kiosk__gate__wrong: "PIN incorrecto. Inténtalo de nuevo.",
    kiosk__gate__rate_limited:
      "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
    kiosk__share__eyebrow: "Compartir el enlace del kiosco",
    kiosk__share__desc:
      "Envía este enlace a quien instale el kiosco el día. Necesitará el PIN para abrirlo.",
    kiosk__share__copy: "Copiar enlace",
    kiosk__share__copied: "¡Copiado!",
    kiosk__share__pin_set:
      "El PIN predeterminado es 1234. Cámbialo desde la tarjeta de bloqueo antes de compartir.",
  },
  et: {
    kiosk_setup__pin__change: "Muuda PINi",
    kiosk__gate__title: "Sisestage kioski PIN",
    kiosk__gate__hint: "Sisestage 4-kohaline PIN, et kiosk avada.",
    kiosk__gate__submit: "Ava kiosk",
    kiosk__gate__verifying: "Kontrollimine…",
    kiosk__gate__wrong: "Vale PIN. Proovi uuesti.",
    kiosk__gate__rate_limited:
      "Liiga palju katseid. Oota hetk ja proovi uuesti.",
    kiosk__share__eyebrow: "Jaga kioski linki",
    kiosk__share__desc:
      "Saada see link inimesele, kes kioski päeval üles seab. Avamiseks vajab ta PINi.",
    kiosk__share__copy: "Kopeeri link",
    kiosk__share__copied: "Kopeeritud!",
    kiosk__share__pin_set:
      "Vaikimisi PIN on 1234. Muuda see lukustuskaardilt enne jagamist.",
  },
  fi: {
    kiosk_setup__pin__change: "Vaihda PIN",
    kiosk__gate__title: "Syötä kioskin PIN",
    kiosk__gate__hint: "Anna 4-numeroinen PIN avataksesi kioskin.",
    kiosk__gate__submit: "Avaa kioski",
    kiosk__gate__verifying: "Tarkistetaan…",
    kiosk__gate__wrong: "Väärä PIN. Yritä uudelleen.",
    kiosk__gate__rate_limited:
      "Liian monta yritystä. Odota hetki ja yritä uudelleen.",
    kiosk__share__eyebrow: "Jaa kioskilinkki",
    kiosk__share__desc:
      "Lähetä tämä linkki henkilölle, joka asentaa kioskin paikan päällä. He tarvitsevat PIN-koodin avatakseen sen.",
    kiosk__share__copy: "Kopioi linkki",
    kiosk__share__copied: "Kopioitu!",
    kiosk__share__pin_set:
      "Oletus-PIN on 1234. Vaihda se lukituskortista ennen jakamista.",
  },
  fil: {
    kiosk_setup__pin__change: "Baguhin ang PIN",
    kiosk__gate__title: "Ilagay ang kiosk PIN",
    kiosk__gate__hint: "I-type ang 4-digit PIN para buksan ang kiosk.",
    kiosk__gate__submit: "Buksan ang kiosk",
    kiosk__gate__verifying: "Sinusuri…",
    kiosk__gate__wrong: "Maling PIN. Subukang muli.",
    kiosk__gate__rate_limited:
      "Masyadong maraming pagsubok. Maghintay sandali at subukang muli.",
    kiosk__share__eyebrow: "Ibahagi ang link ng kiosk",
    kiosk__share__desc:
      "Ipadala ang link na ito sa magse-set up ng kiosk sa araw. Kakailanganin nila ang PIN para mabuksan ito.",
    kiosk__share__copy: "Kopyahin ang link",
    kiosk__share__copied: "Nakopya!",
    kiosk__share__pin_set:
      "Ang default na PIN ay 1234. Baguhin mula sa lock-down card bago ibahagi.",
  },
  fr: {
    kiosk_setup__pin__change: "Modifier le PIN",
    kiosk__gate__title: "Saisir le PIN du kiosque",
    kiosk__gate__hint: "Tapez le PIN à 4 chiffres pour ouvrir le kiosque.",
    kiosk__gate__submit: "Ouvrir le kiosque",
    kiosk__gate__verifying: "Vérification…",
    kiosk__gate__wrong: "PIN incorrect. Réessayez.",
    kiosk__gate__rate_limited:
      "Trop de tentatives. Attendez un instant et réessayez.",
    kiosk__share__eyebrow: "Partager le lien du kiosque",
    kiosk__share__desc:
      "Envoyez ce lien à la personne qui installera le kiosque le jour J. Elle aura besoin du PIN pour l'ouvrir.",
    kiosk__share__copy: "Copier le lien",
    kiosk__share__copied: "Copié !",
    kiosk__share__pin_set:
      "Le PIN par défaut est 1234. Modifiez-le depuis la carte de verrouillage avant de partager.",
  },
  hr: {
    kiosk_setup__pin__change: "Promijeni PIN",
    kiosk__gate__title: "Unesi PIN kioska",
    kiosk__gate__hint: "Upiši 4-znamenkasti PIN za otvaranje kioska.",
    kiosk__gate__submit: "Otvori kiosk",
    kiosk__gate__verifying: "Provjera…",
    kiosk__gate__wrong: "Pogrešan PIN. Pokušaj ponovo.",
    kiosk__gate__rate_limited:
      "Previše pokušaja. Pričekaj trenutak i pokušaj ponovo.",
    kiosk__share__eyebrow: "Podijeli vezu kioska",
    kiosk__share__desc:
      "Pošalji ovu vezu osobi koja će postaviti kiosk na dan. Trebat će joj PIN za otvaranje.",
    kiosk__share__copy: "Kopiraj vezu",
    kiosk__share__copied: "Kopirano!",
    kiosk__share__pin_set:
      "Zadani PIN je 1234. Promijeni ga u kartici zaključavanja prije dijeljenja.",
  },
  hu: {
    kiosk_setup__pin__change: "PIN módosítása",
    kiosk__gate__title: "Adja meg a kioszk PIN-kódját",
    kiosk__gate__hint: "Írja be a 4 jegyű PIN-kódot a kioszk megnyitásához.",
    kiosk__gate__submit: "Kioszk megnyitása",
    kiosk__gate__verifying: "Ellenőrzés…",
    kiosk__gate__wrong: "Hibás PIN. Próbálja újra.",
    kiosk__gate__rate_limited:
      "Túl sok próbálkozás. Várjon egy pillanatot, és próbálja újra.",
    kiosk__share__eyebrow: "Kioszk hivatkozás megosztása",
    kiosk__share__desc:
      "Küldje el ezt a linket annak, aki a kioszkot a napon beállítja. Szüksége lesz a PIN-kódra a megnyitáshoz.",
    kiosk__share__copy: "Hivatkozás másolása",
    kiosk__share__copied: "Másolva!",
    kiosk__share__pin_set:
      "Alapértelmezett PIN: 1234. Módosítsa a lezárás kártyán megosztás előtt.",
  },
  id: {
    kiosk_setup__pin__change: "Ubah PIN",
    kiosk__gate__title: "Masukkan PIN kiosk",
    kiosk__gate__hint: "Ketik PIN 4 digit untuk membuka kiosk.",
    kiosk__gate__submit: "Buka kiosk",
    kiosk__gate__verifying: "Memeriksa…",
    kiosk__gate__wrong: "PIN salah. Coba lagi.",
    kiosk__gate__rate_limited:
      "Terlalu banyak percobaan. Tunggu sebentar dan coba lagi.",
    kiosk__share__eyebrow: "Bagikan tautan kiosk",
    kiosk__share__desc:
      "Kirim tautan ini ke orang yang akan menyiapkan kiosk pada hari acara. Mereka memerlukan PIN untuk membukanya.",
    kiosk__share__copy: "Salin tautan",
    kiosk__share__copied: "Disalin!",
    kiosk__share__pin_set:
      "PIN default adalah 1234. Ubah dari kartu pengunci sebelum membagikan.",
  },
  it: {
    kiosk_setup__pin__change: "Cambia PIN",
    kiosk__gate__title: "Inserisci il PIN del kiosco",
    kiosk__gate__hint: "Digita il PIN a 4 cifre per aprire il kiosco.",
    kiosk__gate__submit: "Apri kiosco",
    kiosk__gate__verifying: "Verifica in corso…",
    kiosk__gate__wrong: "PIN errato. Riprova.",
    kiosk__gate__rate_limited:
      "Troppi tentativi. Attendi un momento e riprova.",
    kiosk__share__eyebrow: "Condividi il link del kiosco",
    kiosk__share__desc:
      "Invia questo link a chi allestirà il kiosco il giorno. Avrà bisogno del PIN per aprirlo.",
    kiosk__share__copy: "Copia link",
    kiosk__share__copied: "Copiato!",
    kiosk__share__pin_set:
      "Il PIN predefinito è 1234. Cambialo dalla scheda di blocco prima di condividere.",
  },
  ko: {
    kiosk_setup__pin__change: "PIN 변경",
    kiosk__gate__title: "키오스크 PIN 입력",
    kiosk__gate__hint: "키오스크를 열려면 4자리 PIN을 입력하세요.",
    kiosk__gate__submit: "키오스크 열기",
    kiosk__gate__verifying: "확인 중…",
    kiosk__gate__wrong: "잘못된 PIN입니다. 다시 시도하세요.",
    kiosk__gate__rate_limited:
      "시도가 너무 많습니다. 잠시 후 다시 시도하세요.",
    kiosk__share__eyebrow: "키오스크 링크 공유",
    kiosk__share__desc:
      "당일 키오스크를 설치할 사람에게 이 링크를 보내세요. 열기 위해 PIN이 필요합니다.",
    kiosk__share__copy: "링크 복사",
    kiosk__share__copied: "복사됨!",
    kiosk__share__pin_set:
      "기본 PIN은 1234입니다. 공유하기 전에 잠금 카드에서 변경하세요.",
  },
  lt: {
    kiosk_setup__pin__change: "Keisti PIN",
    kiosk__gate__title: "Įveskite kiosko PIN",
    kiosk__gate__hint: "Įveskite 4 skaitmenų PIN, kad atidarytumėte kioską.",
    kiosk__gate__submit: "Atidaryti kioską",
    kiosk__gate__verifying: "Tikrinama…",
    kiosk__gate__wrong: "Neteisingas PIN. Bandykite dar kartą.",
    kiosk__gate__rate_limited:
      "Per daug bandymų. Palaukite akimirką ir bandykite dar kartą.",
    kiosk__share__eyebrow: "Dalintis kiosko nuoroda",
    kiosk__share__desc:
      "Nusiųskite šią nuorodą tam, kas tą dieną nustatys kioską. Jam reikės PIN, kad atidarytų.",
    kiosk__share__copy: "Kopijuoti nuorodą",
    kiosk__share__copied: "Nukopijuota!",
    kiosk__share__pin_set:
      "Numatytasis PIN yra 1234. Pakeiskite jį užrakto kortelėje prieš dalindamiesi.",
  },
  lv: {
    kiosk_setup__pin__change: "Mainīt PIN",
    kiosk__gate__title: "Ievadiet kioska PIN",
    kiosk__gate__hint: "Ierakstiet 4 ciparu PIN, lai atvērtu kiosku.",
    kiosk__gate__submit: "Atvērt kiosku",
    kiosk__gate__verifying: "Pārbauda…",
    kiosk__gate__wrong: "Nepareizs PIN. Mēģiniet vēlreiz.",
    kiosk__gate__rate_limited:
      "Pārāk daudz mēģinājumu. Pagaidiet brīdi un mēģiniet vēlreiz.",
    kiosk__share__eyebrow: "Kopīgot kioska saiti",
    kiosk__share__desc:
      "Nosūtiet šo saiti personai, kas kiosku iestatīs dienā. Tai būs nepieciešams PIN, lai to atvērtu.",
    kiosk__share__copy: "Kopēt saiti",
    kiosk__share__copied: "Nokopēts!",
    kiosk__share__pin_set:
      "Noklusējuma PIN ir 1234. Mainiet to bloķēšanas kartē pirms kopīgošanas.",
  },
  ms: {
    kiosk_setup__pin__change: "Tukar PIN",
    kiosk__gate__title: "Masukkan PIN kiosk",
    kiosk__gate__hint: "Taip PIN 4 digit untuk membuka kiosk.",
    kiosk__gate__submit: "Buka kiosk",
    kiosk__gate__verifying: "Menyemak…",
    kiosk__gate__wrong: "PIN salah. Cuba lagi.",
    kiosk__gate__rate_limited:
      "Terlalu banyak percubaan. Tunggu seketika dan cuba lagi.",
    kiosk__share__eyebrow: "Kongsi pautan kiosk",
    kiosk__share__desc:
      "Hantar pautan ini kepada sesiapa yang akan menetapkan kiosk pada hari itu. Mereka memerlukan PIN untuk membukanya.",
    kiosk__share__copy: "Salin pautan",
    kiosk__share__copied: "Disalin!",
    kiosk__share__pin_set:
      "PIN lalai ialah 1234. Tukarnya dari kad kunci sebelum berkongsi.",
  },
  nl: {
    kiosk_setup__pin__change: "PIN wijzigen",
    kiosk__gate__title: "Voer kiosk-PIN in",
    kiosk__gate__hint: "Voer de 4-cijferige PIN in om de kiosk te openen.",
    kiosk__gate__submit: "Kiosk openen",
    kiosk__gate__verifying: "Controleren…",
    kiosk__gate__wrong: "Onjuiste PIN. Probeer het opnieuw.",
    kiosk__gate__rate_limited:
      "Te veel pogingen. Wacht even en probeer het opnieuw.",
    kiosk__share__eyebrow: "Deel de kiosk-link",
    kiosk__share__desc:
      "Stuur deze link naar degene die de kiosk op de dag instelt. Ze hebben de PIN nodig om hem te openen.",
    kiosk__share__copy: "Link kopiëren",
    kiosk__share__copied: "Gekopieerd!",
    kiosk__share__pin_set:
      "Standaard-PIN is 1234. Wijzig deze in de vergrendelingskaart voordat je deelt.",
  },
  no: {
    kiosk_setup__pin__change: "Endre PIN",
    kiosk__gate__title: "Skriv inn kiosk-PIN",
    kiosk__gate__hint: "Skriv inn 4-sifret PIN for å åpne kiosken.",
    kiosk__gate__submit: "Åpne kiosk",
    kiosk__gate__verifying: "Kontrollerer…",
    kiosk__gate__wrong: "Feil PIN. Prøv igjen.",
    kiosk__gate__rate_limited:
      "For mange forsøk. Vent et øyeblikk og prøv igjen.",
    kiosk__share__eyebrow: "Del kiosk-lenken",
    kiosk__share__desc:
      "Send denne lenken til den som setter opp kiosken på dagen. De trenger PIN-en for å åpne den.",
    kiosk__share__copy: "Kopier lenke",
    kiosk__share__copied: "Kopiert!",
    kiosk__share__pin_set:
      "Standard-PIN er 1234. Endre den i låsekortet før deling.",
  },
  pl: {
    kiosk_setup__pin__change: "Zmień PIN",
    kiosk__gate__title: "Wprowadź PIN kiosku",
    kiosk__gate__hint: "Wpisz 4-cyfrowy PIN, aby otworzyć kiosk.",
    kiosk__gate__submit: "Otwórz kiosk",
    kiosk__gate__verifying: "Sprawdzanie…",
    kiosk__gate__wrong: "Nieprawidłowy PIN. Spróbuj ponownie.",
    kiosk__gate__rate_limited:
      "Zbyt wiele prób. Zaczekaj chwilę i spróbuj ponownie.",
    kiosk__share__eyebrow: "Udostępnij link do kiosku",
    kiosk__share__desc:
      "Wyślij ten link osobie, która ustawi kiosk w danym dniu. Będzie potrzebować PIN-u, aby go otworzyć.",
    kiosk__share__copy: "Kopiuj link",
    kiosk__share__copied: "Skopiowano!",
    kiosk__share__pin_set:
      "Domyślny PIN to 1234. Zmień go w karcie blokady przed udostępnieniem.",
  },
  pt: {
    kiosk_setup__pin__change: "Alterar PIN",
    kiosk__gate__title: "Introduzir PIN do quiosque",
    kiosk__gate__hint: "Digite o PIN de 4 dígitos para abrir o quiosque.",
    kiosk__gate__submit: "Abrir quiosque",
    kiosk__gate__verifying: "A verificar…",
    kiosk__gate__wrong: "PIN incorreto. Tente novamente.",
    kiosk__gate__rate_limited:
      "Demasiadas tentativas. Aguarde um momento e tente novamente.",
    kiosk__share__eyebrow: "Partilhar o link do quiosque",
    kiosk__share__desc:
      "Envie este link a quem montar o quiosque no dia. Precisará do PIN para o abrir.",
    kiosk__share__copy: "Copiar link",
    kiosk__share__copied: "Copiado!",
    kiosk__share__pin_set:
      "O PIN predefinido é 1234. Altere-o no cartão de bloqueio antes de partilhar.",
  },
  ro: {
    kiosk_setup__pin__change: "Schimbă PIN-ul",
    kiosk__gate__title: "Introdu PIN-ul kioscului",
    kiosk__gate__hint: "Introdu PIN-ul de 4 cifre pentru a deschide kioscul.",
    kiosk__gate__submit: "Deschide kioscul",
    kiosk__gate__verifying: "Se verifică…",
    kiosk__gate__wrong: "PIN incorect. Încearcă din nou.",
    kiosk__gate__rate_limited:
      "Prea multe încercări. Așteaptă un moment și încearcă din nou.",
    kiosk__share__eyebrow: "Distribuie linkul kioscului",
    kiosk__share__desc:
      "Trimite acest link persoanei care va instala kioscul în ziua respectivă. Va avea nevoie de PIN pentru a-l deschide.",
    kiosk__share__copy: "Copiază linkul",
    kiosk__share__copied: "Copiat!",
    kiosk__share__pin_set:
      "PIN-ul implicit este 1234. Schimbă-l din cardul de blocare înainte de distribuire.",
  },
  sk: {
    kiosk_setup__pin__change: "Zmeniť PIN",
    kiosk__gate__title: "Zadajte PIN kiosku",
    kiosk__gate__hint: "Zadajte 4-miestny PIN na otvorenie kiosku.",
    kiosk__gate__submit: "Otvoriť kiosk",
    kiosk__gate__verifying: "Overuje sa…",
    kiosk__gate__wrong: "Nesprávny PIN. Skúste znova.",
    kiosk__gate__rate_limited:
      "Príliš veľa pokusov. Počkajte chvíľu a skúste znova.",
    kiosk__share__eyebrow: "Zdieľať odkaz na kiosk",
    kiosk__share__desc:
      "Pošlite tento odkaz osobe, ktorá bude kiosk v deň akcie inštalovať. Bude potrebovať PIN na jeho otvorenie.",
    kiosk__share__copy: "Kopírovať odkaz",
    kiosk__share__copied: "Skopírované!",
    kiosk__share__pin_set:
      "Predvolený PIN je 1234. Zmeňte ho v karte zamknutia pred zdieľaním.",
  },
  sl: {
    kiosk_setup__pin__change: "Spremeni PIN",
    kiosk__gate__title: "Vnesite PIN kioska",
    kiosk__gate__hint: "Vpišite 4-mestni PIN za odpiranje kioska.",
    kiosk__gate__submit: "Odpri kiosk",
    kiosk__gate__verifying: "Preverjanje…",
    kiosk__gate__wrong: "Napačen PIN. Poskusite znova.",
    kiosk__gate__rate_limited:
      "Preveč poskusov. Počakajte trenutek in poskusite znova.",
    kiosk__share__eyebrow: "Deli povezavo kioska",
    kiosk__share__desc:
      "Pošljite to povezavo osebi, ki bo kiosk postavila na dan dogodka. Za odpiranje bo potrebovala PIN.",
    kiosk__share__copy: "Kopiraj povezavo",
    kiosk__share__copied: "Kopirano!",
    kiosk__share__pin_set:
      "Privzeti PIN je 1234. Spremenite ga v kartici zaklepanja pred deljenjem.",
  },
  sv: {
    kiosk_setup__pin__change: "Ändra PIN",
    kiosk__gate__title: "Ange kiosk-PIN",
    kiosk__gate__hint: "Skriv den 4-siffriga PIN-koden för att öppna kiosken.",
    kiosk__gate__submit: "Öppna kiosk",
    kiosk__gate__verifying: "Kontrollerar…",
    kiosk__gate__wrong: "Fel PIN. Försök igen.",
    kiosk__gate__rate_limited:
      "För många försök. Vänta en stund och försök igen.",
    kiosk__share__eyebrow: "Dela kiosk-länken",
    kiosk__share__desc:
      "Skicka denna länk till den som ställer in kiosken på dagen. De behöver PIN-koden för att öppna den.",
    kiosk__share__copy: "Kopiera länk",
    kiosk__share__copied: "Kopierat!",
    kiosk__share__pin_set:
      "Standard-PIN är 1234. Ändra den i låsningskortet före delning.",
  },
  th: {
    kiosk_setup__pin__change: "เปลี่ยน PIN",
    kiosk__gate__title: "ป้อน PIN ของคีออส",
    kiosk__gate__hint: "พิมพ์ PIN 4 หลักเพื่อเปิดคีออส",
    kiosk__gate__submit: "เปิดคีออส",
    kiosk__gate__verifying: "กำลังตรวจสอบ…",
    kiosk__gate__wrong: "PIN ไม่ถูกต้อง โปรดลองอีกครั้ง",
    kiosk__gate__rate_limited:
      "พยายามมากเกินไป โปรดรอสักครู่แล้วลองอีกครั้ง",
    kiosk__share__eyebrow: "แชร์ลิงก์คีออส",
    kiosk__share__desc:
      "ส่งลิงก์นี้ให้ผู้ที่จะตั้งค่าคีออสในวันงาน พวกเขาต้องใช้ PIN เพื่อเปิด",
    kiosk__share__copy: "คัดลอกลิงก์",
    kiosk__share__copied: "คัดลอกแล้ว!",
    kiosk__share__pin_set: "PIN เริ่มต้นคือ 1234 เปลี่ยนได้ในการ์ดล็อกก่อนแชร์",
  },
  tr: {
    kiosk_setup__pin__change: "PIN'i değiştir",
    kiosk__gate__title: "Kiosk PIN'ini girin",
    kiosk__gate__hint: "Kioskı açmak için 4 haneli PIN'i girin.",
    kiosk__gate__submit: "Kioskı aç",
    kiosk__gate__verifying: "Doğrulanıyor…",
    kiosk__gate__wrong: "Yanlış PIN. Tekrar deneyin.",
    kiosk__gate__rate_limited:
      "Çok fazla deneme. Bir süre bekleyin ve tekrar deneyin.",
    kiosk__share__eyebrow: "Kiosk bağlantısını paylaş",
    kiosk__share__desc:
      "Bu bağlantıyı, kioskı gün içinde kuracak kişiye gönderin. Açmak için PIN'e ihtiyaçları olacak.",
    kiosk__share__copy: "Bağlantıyı kopyala",
    kiosk__share__copied: "Kopyalandı!",
    kiosk__share__pin_set:
      "Varsayılan PIN 1234'tür. Paylaşmadan önce kilit kartından değiştirin.",
  },
  uk: {
    kiosk_setup__pin__change: "Змінити PIN",
    kiosk__gate__title: "Введіть PIN кіоску",
    kiosk__gate__hint: "Введіть 4-значний PIN, щоб відкрити кіоск.",
    kiosk__gate__submit: "Відкрити кіоск",
    kiosk__gate__verifying: "Перевірка…",
    kiosk__gate__wrong: "Неправильний PIN. Спробуйте ще раз.",
    kiosk__gate__rate_limited:
      "Забагато спроб. Зачекайте хвилинку та спробуйте ще раз.",
    kiosk__share__eyebrow: "Поділіться посиланням на кіоск",
    kiosk__share__desc:
      "Надішліть це посилання тому, хто налаштовуватиме кіоск у день події. Йому знадобиться PIN, щоб його відкрити.",
    kiosk__share__copy: "Копіювати посилання",
    kiosk__share__copied: "Скопійовано!",
    kiosk__share__pin_set:
      "Стандартний PIN — 1234. Змініть його у картці блокування перед поширенням.",
  },
  vi: {
    kiosk_setup__pin__change: "Đổi PIN",
    kiosk__gate__title: "Nhập PIN kiosk",
    kiosk__gate__hint: "Nhập PIN 4 chữ số để mở kiosk.",
    kiosk__gate__submit: "Mở kiosk",
    kiosk__gate__verifying: "Đang kiểm tra…",
    kiosk__gate__wrong: "PIN sai. Vui lòng thử lại.",
    kiosk__gate__rate_limited:
      "Quá nhiều lần thử. Vui lòng đợi một chút và thử lại.",
    kiosk__share__eyebrow: "Chia sẻ liên kết kiosk",
    kiosk__share__desc:
      "Gửi liên kết này cho người sẽ thiết lập kiosk trong ngày. Họ sẽ cần PIN để mở.",
    kiosk__share__copy: "Sao chép liên kết",
    kiosk__share__copied: "Đã sao chép!",
    kiosk__share__pin_set:
      "PIN mặc định là 1234. Hãy đổi từ thẻ khóa trước khi chia sẻ.",
  },
};

const errorKeys = {
  cs: { errors__kiosk_pin_invalid: "Tento PIN nesouhlasí. Zkuste to znovu." },
  da: { errors__kiosk_pin_invalid: "Den PIN passer ikke. Prøv igen." },
  de: { errors__kiosk_pin_invalid: "PIN stimmt nicht. Bitte erneut versuchen." },
  el: { errors__kiosk_pin_invalid: "Αυτό το PIN δεν ταιριάζει. Δοκιμάστε ξανά." },
  es: { errors__kiosk_pin_invalid: "Ese PIN no coincide. Inténtalo de nuevo." },
  et: { errors__kiosk_pin_invalid: "See PIN ei ühti. Proovi uuesti." },
  fi: { errors__kiosk_pin_invalid: "PIN ei täsmää. Yritä uudelleen." },
  fil: { errors__kiosk_pin_invalid: "Hindi tumutugma ang PIN na ito. Subukang muli." },
  fr: { errors__kiosk_pin_invalid: "Ce PIN ne correspond pas. Réessayez." },
  hr: { errors__kiosk_pin_invalid: "Taj PIN ne odgovara. Pokušaj ponovo." },
  hu: { errors__kiosk_pin_invalid: "A PIN nem egyezik. Próbálja újra." },
  id: { errors__kiosk_pin_invalid: "PIN ini tidak cocok. Coba lagi." },
  it: { errors__kiosk_pin_invalid: "Questo PIN non corrisponde. Riprova." },
  ko: { errors__kiosk_pin_invalid: "PIN이 일치하지 않습니다. 다시 시도하세요." },
  lt: { errors__kiosk_pin_invalid: "Šis PIN nesutampa. Bandykite dar kartą." },
  lv: { errors__kiosk_pin_invalid: "Šis PIN nesakrīt. Mēģiniet vēlreiz." },
  ms: { errors__kiosk_pin_invalid: "PIN ini tidak sepadan. Cuba lagi." },
  nl: { errors__kiosk_pin_invalid: "Die PIN klopt niet. Probeer het opnieuw." },
  no: { errors__kiosk_pin_invalid: "Den PIN-en passer ikke. Prøv igjen." },
  pl: { errors__kiosk_pin_invalid: "Ten PIN nie pasuje. Spróbuj ponownie." },
  pt: { errors__kiosk_pin_invalid: "Esse PIN não corresponde. Tente novamente." },
  ro: { errors__kiosk_pin_invalid: "Acest PIN nu se potrivește. Încearcă din nou." },
  sk: { errors__kiosk_pin_invalid: "Tento PIN nesúhlasí. Skúste znova." },
  sl: { errors__kiosk_pin_invalid: "Ta PIN se ne ujema. Poskusite znova." },
  sv: { errors__kiosk_pin_invalid: "PIN-koden stämmer inte. Försök igen." },
  th: { errors__kiosk_pin_invalid: "PIN ไม่ตรงกัน โปรดลองอีกครั้ง" },
  tr: { errors__kiosk_pin_invalid: "Bu PIN eşleşmedi. Tekrar deneyin." },
  uk: { errors__kiosk_pin_invalid: "Цей PIN не збігається. Спробуйте ще раз." },
  vi: { errors__kiosk_pin_invalid: "PIN này không khớp. Vui lòng thử lại." },
};

const mergeIntoFile = (path, additions) => {
  const data = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  let changed = !existsSync(path);
  for (const [key, value] of Object.entries(additions)) {
    if (!(key in data)) {
      data[key] = value;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
  }
  return changed;
};

const locales = Object.keys(kioskKeys);
let touched = 0;
for (const locale of locales) {
  const kioskPath = resolve(MESSAGES_DIR, locale, "kiosk.json");
  const errorsPath = resolve(MESSAGES_DIR, locale, "errors.json");
  if (mergeIntoFile(kioskPath, kioskKeys[locale])) touched++;
  if (mergeIntoFile(errorsPath, errorKeys[locale])) touched++;
  console.log(`merged: ${locale}`);
}
console.log(`done — ${touched} file(s) updated`);
