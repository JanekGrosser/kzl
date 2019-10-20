
var translations = {
    pl: {
        header: {

        },
        footer: {

        },
        common: {
            brand: "NetInser Grafik",
            back: "Wróc",
            csrPlaceholder: "Login (CSR)",
            password: "Hasło",
            serverError: "Wystąpił błąd - spróbuj ponownie lub skontaktuj się z administratorem",
            close: "Zamknij",
            save: "Zapisz",
            addUser: "Dodaj użytkownika",
            changePassword: "Zmień hasło",
            editUser: "Edytuj użytkownika"
        },
        login: {
            forgotPassword: "Nie pamiętasz hasła ?",
            button: "Zaloguj się",
            missingCredentials: "Nie podano loginu i hasła",
            wrongCredentials: "Zły login lub hasło",
        },
        passwordReset: {
            wrongCsr: "Zły login",
            button: "Wyślij",
            header: "Resetuj hasło",
            success: "Hasło zostało wysłane SMSem"
        },
        changePassword: {
            success: "Hasło zostało zmienione",
            newPassword: "Nowe hasło",
            changePassword: "Zmień hasło",
            wrongPassword: "Złe hasło"
        },
        editUser: {
            header: "Edytuj użytkownika"
        }
    }
}

export default function(lang) {
    if (!lang) lang = "pl";
    return translations[lang];
}