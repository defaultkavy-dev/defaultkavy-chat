import index from './index.html';
Bun.serve({
    routes: {
        '/*': index
    },
    port: 9999
})