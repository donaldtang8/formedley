export class User {

    constructor(
        public id: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public username: string,
        public role: string,
        private token: string,
        public tokenExpirationDate: Date
    ) {}

    get getToken() {
        if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
            return 'null';
        }
        return this.token;
    }
}