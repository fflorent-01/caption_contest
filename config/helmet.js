const helmetConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "https://cdn.jsdelivr.net/npm/", 
                "https://code.jquery.com/",
            ],
            styleSrc: [
                "'self'", 
                "https://cdn.jsdelivr.net/npm/", 
                "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/",
            ],
        }
    }
}

module.exports = helmetConfig
