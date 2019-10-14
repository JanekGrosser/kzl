
var translations = {
    pl: {
        common: {
            back: "Wróc",
            csrPlaceholder: "Login (CSR)",
            passwordPlaceholder: "Hasło",
            serverError: "Wystąpił błąd - spróbuj ponownie lub skontaktuj się z administratorem"
        },
        login: {
            forgotPassword: "Nie pamiętasz hasła ?",
            header: "NetInser Grafik",
            button: "Zaloguj się",
            missingCredentials: "Nie podano loginu i hasła",
            wrongCredentials: "Zły login lub hasło",
        },
        passwordReset: {
            wrongCsr: "Zły login",
            button: "Wyślij",
            header: "Resetuj hasło",
            success: "Hasło zostało wysłane SMSem"
        }
    }
}

export default function(lang) {
    if (!lang) lang = "pl";
    return translations[lang];
}