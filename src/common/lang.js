var translations = {
    pl: {
        login: "Zaloguj",
        brand: "NetInser Grafik",
        back: "Wróc",
        csrPlaceholder: "Login (CSR)",
        csr: "CSR",
        password: "Hasło",
        serverError: "Wystąpił błąd - spróbuj ponownie lub skontaktuj się z administratorem",
        close: "Zamknij",
        save: "Zapisz",
        addUser: "Dodaj użytkownika",
        changePassword: "Zmień hasło",
        editUser: "Edytuj użytkownika",
        forgotPassword: "Nie pamiętasz hasła ?",
        loginButton: "Zaloguj się",
        missingCredentials: "Nie podano loginu i hasła",
        wrongCredentials: "Zły login lub hasło",
        wrongCsr: "Zły login",
        send: "Wyślij",
        resetPassword: "Resetuj hasło",
        passwordSentSMS: "Hasło zostało wysłane SMSem",
        passwordChanged: "Hasło zostało zmienione",
        newPassword: "Nowe hasło",
        changePassword: "Zmień hasło",
        wrongPassword: "Złe hasło",
        editUser: "Edytuj użytkownika",
        addUser: "Dodaj użytkownika",
        chosenSubdivisions: "Wybrani podwykonawcy",
        logout: "Wyloguj",
        role: "Rola",
        choose: "Wybierz rolę",
        active: "Aktywny",
        deleteUser: "Usuń użytkownika",
        addNewSubdivision: "Dodaj nowego podwykonawcę",
        userEdited: "Użytkownik {0} został zapisany",
        userDeleted: "Użytkownik {0} został usunięty",
        userEditError: "Wystąpił błąd przy zapisywaniu użytkownika {0}. Spróbuj ponownie",
        userDeleteError: "Wystąpił błąd przy usuwaniu użytkownika {0}. Spróbuj ponownie",
        userAdded: "Użytkownik {0} został dodany",
        userAddedError: "Wystąpił błąd przy dodawaniu użytkownika {0}. Spróbuj ponownie",
        homeView: "Widok główny",
        users: "Użytkownicy",
        subdivisions: "Podwykowawcy",
        subdivision: "Podwykonawca",
        edit: "Edytuj",
        firstName: "Imię",
        lastName: "Nazwisko",
        telephone: "Telefon",
        search: "Szukaj",
        month: "Miesiąc",
        currentCalendar: "Kalendarz bieżący",
        bookingCalendar: "Kalendarz rezerwacji grafiku",
        summaryDaily: "Kalendarz dzienny zbiorczy",
        technicianCalendar: "Kalendarz technika",
        chooseTechnician: "Wybierz rodzaj technika",
        noTechnicians: "Brak techników",
        noUserResults: "Brak użytkowników",
        editable: "Zapisany (kopia robocza)",
        approval: "Wysłane do zatwierdzenia",
        disabled: "Termin wykonany",
        "approval-added": "Dodano termin przed zatwierdzeniem",
        "approval-removed": "Usunięto termin przed zatwierdzeniem",
        "approved": "Zatwierdzony termin",
        "approved-added": "Dodano termin",
        "approved-removed": "Usunięto termin",
        "current-added": "Dodano termin bieżący",
        "current-removed": "Usunięto termin bieżący",
        "past": "Wykonano",
        alertCannotEditPastCalendar: "Kalendarz przeszły",
        alertEditingCurrentCalendar: "Kalendarz bieżacy",
        alertDisplayingReservationCalendar: "Kalendarz rezerwacji",
        alertCalendarConfirmed: "Kalendarz potwierdzony",
        alertCalendarSaved: "Kalendarz zapisany",
        alertCalendarCannotSaveCalendar: "Czas edycji kalendarza upłynął",
        alertCalendarError: "Wystąpił błąd. Spróbuj ponownie",
        alertCalendarCurrentChanged: "Kalendarz bieżacy zmieniony",
        alertEditingApprovalCalendar: "Kalendarz w fazie zatwierdzania",
        alertCalendarSentToApproval: "Kalendarz został wysłany do zatwierdzenia",
        technicianRole: "Rola technika",
        technician: "Technik",
        reset: "Resetuj",
        save: "Zapisz (kopia robocza)",
        sendToApproval: "Wyślij do zatwierdzenia",
        confirm: "Zatwierdź",
        change: "Zmień",
        noResults: "Brak wyników",
        dayArray: [
            "Nd","Pn","Wt","Śr","Czw","Pt","Sb"
        ]
    }
}

export default function(lang) {
    if (!lang) lang = "pl";
    return translations[lang];
}