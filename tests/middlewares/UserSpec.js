var rewire = require('rewire'),
    UserFile = rewire('../../middlewares/User.js'),
    crypto = require('crypto');

describe('/middlewares/User.js:', function () {

    var User = UserFile.User,
        Anonym = UserFile.Anonym,
        U,
        A,
        name,
        role;

    beforeEach(function () {
    });

    describe('Anonymous user:', function () {

        beforeEach(function () {
            name = 'ImTheUser';
            A = new Anonym(name);
        });

        it('Anonymous user object should have appropriate fields and functions', function () {
            expect(A.name).toBe(name);
            expect(A.role).toBe('ANONYMOUS');
            expect(A.language).toBeDefined();
            expect(typeof A.getUserData).toEqual('function');

        });

        it('getUserData should return real user data', function () {

            var data = A.getUserData();

            expect(data.name).toBe(name);
            expect(data.role).toBe('ANONYMOUS');
            expect(data.language).toBeDefined();
        });

    });


    describe('Regular user:', function () {

        beforeEach(function () {
            name = 'ImTheUser';
            role = 'ADMIN';
            U = new User(name, role);
        });

        it('User should call Anonym constructor with `this` object and name', function () {

            var U,
                A = UserFile.__get__('Anonym');

            spyOn(A, 'call');

            U = new User(name, role);

            expect(A.call).toHaveBeenCalledWith(U, name);
        });

        it('Regular user constructor should set default role when role param is missing', function () {

            U = new User(name);
            expect(U.role).toBe('SIMPLE');

        });

        it('Regular user object should have appropriate fields and functions', function () {

            expect(U.name).toBe(name);
            expect(U.role).toBe(role);
            expect(U.language).toBeDefined();
            expect(U.password).toBeDefined();
            expect(U.email).toBeDefined();
            expect(U.color).toBeDefined();
            expect(typeof U.setPassword).toEqual('function');
            expect(typeof U.setColor).toEqual('function');

        });

        it('getUserData should return real user data', function () {

            var data = U.getUserData();

            expect(U.name).toBe(name);
            expect(U.role).toBe(role);
            expect(U.language).toBeDefined();
            expect(U.password).toBeDefined();
            expect(U.email).toBeDefined();
        });

        it('color should have hex format and should be random', function () {

            var originalColor = U.color;

            expect(originalColor).toMatch('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');

            U.setColor();

            expect(U.color).toMatch('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');
            expect(U.color).not.toBe(originalColor);
        });

        it('userDataMap should be a private objet member', function () {

            expect(U.userDataMap).toBeUndefined();
        });

        it('setPassword should create correct hash', function () {

            var md5sum = crypto.createHash('md5'),
                password = 'S0meGr34tPassw0rD';

            md5sum.update(password);

            U.setPassword(password);

            expect(U.password).toBe(md5sum.digest('hex'));
        });

    });

});
