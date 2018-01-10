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
            pushContentPath: '/resources/',
            redirectPath: '/content/redirect/'
        }
    }
}