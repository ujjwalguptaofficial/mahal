import UsersHobbie from "../src/components/users_hobbie";
import { expect } from "chai";
import { mount } from "@mahaljs/test-utils";

describe('Nested For', function () {

    let component: UsersHobbie;

    before(async function () {
        component = await mount(UsersHobbie);
    });

    const checkContents = () => {
        const usersEls = component.findAll(".users_item");
        const users = component.users;
        expect(usersEls).length(users.length);

        usersEls.forEach((usersItem, index) => {
            const user = users[index];
            const name = usersItem.querySelector('.users_item_name');
            expect(name.innerHTML).equal(`name - ${user.name}`)
            const hobbies = usersItem.querySelector('.users_item_hobbies');
            const indexFromAttribute = hobbies.getAttribute('index');
            expect(hobbies.classList.contains('ml-4')).equal(indexFromAttribute != '0');
            expect(hobbies.innerHTML).equal(`Hobbies - ${user.hobbies}`)
        });
    }

    it("check list", function () {
        checkContents();
    });

    it('add users using push', async () => {
        component.users.push({
            name: "Batman",
            hobbies: ['protecting gotham', 'engineering']
        })
        await component.waitFor('update');
        checkContents();
    })

    it('update user', async () => {
        component.users[0] = {
            name: 'commander',
            hobbies: ['food', 'code', 'travel']
        };

        await component.waitFor('update');
        checkContents();
    })

    it('remove users', async () => {
        component.users.splice(0, 1);
        await component.waitFor('update');
        checkContents();
    })

    it('overwrite users', async () => {
        component.users = [{
            name: 'superman',
            hobbies: ['flying']
        }];
        await component.waitFor('update');
        checkContents();
    })
});

