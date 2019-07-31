import Home from './routes/Home.svelte'
import Password from './routes/Password.svelte'
import Username from './routes/Username.svelte'
import Domain from './routes/Domain.svelte'
import NotFound from './routes/NotFound.svelte'

const routes = {
    '/': Home,
    '/password/:password': Password,
    '/username/:name': Username,
    '/domain/:domain': Domain,
    // Catch-all
    '*': NotFound,
}

export default routes
