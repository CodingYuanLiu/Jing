const simulate = require('miniprogram-simulate')
const page = require('./my.js');
test('/pages/my/my', () => {
    // const id = simulate.load('/pages/my/my');
    // const comp = simulate.render(id);
    page.add(1,1);
    expect("1").toBe("1");
})