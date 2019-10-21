
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
        edit: "Edytuj",
        firstName: "Imię",
        lastName: "Nazwisko",
        telephone: "Telefon",
        search: "Szukaj"
    }
}

export default function(lang) {
    if (!lang) lang = "pl";
    return translations[lang];
}