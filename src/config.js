// mymodule.js
module.exports = {
    configs: {
        API: {
            baseUrl: 'https://schul-cloud.org',
            port: ':8080',
            pushPort: ':4040',
            authPath: '/authentication',
            pwRecoveryPath: '/login?recovery=true',
            getPath: '/content/resources/',
            searchPath: '/content/search/',
            pushContentPath: '/resources/',
            redirectPath: '/content/redirect/'
        },
        card: {
            displayedTags: 9,
        }
    }
}