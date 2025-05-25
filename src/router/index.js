import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/main.vue'
import musicPlayer from '../components/musicPlayer.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/musicPlayer', name: 'musicPlayer', component: musicPlayer },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router