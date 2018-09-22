import Vue from 'vue'
import Router from 'vue-router'
import DiscoverView from '@/components/views/Discover'
import ArtistsView from '@/components/views/Artists'
import SongsView from '@/components/views/Songs'
import PlaylistsView from '@/components/views/Playlists'
import OfflineView from '@/components/views/Offline'
import SearchView from '@/components/views/Search'
import TrackInfoView from '@/components/views/TrackInfo'
import ArtistInfoView from '@/components/views/ArtistInfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Discover',
      component: DiscoverView
    },
    {
      path: '/Artists',
      name: 'Artists',
      component: ArtistsView
    },
    {
      path: '/Songs',
      name: 'Songs',
      component: SongsView
    },
    {
      path: '/Playlists',
      name: 'Playlists',
      component: PlaylistsView
    },
    {
      path: '/Offline',
      name: 'Offline',
      component: OfflineView
    },
    {
      path: '/Search/:searchString',
      name: 'Search',
      component: SearchView,
      props: true
    },
    {
      path: '/TrackInfo',
      name: 'TrackInfo',
      component: TrackInfoView,
      props: true
    },
    {
      path: '/ArtistInfo',
      name: 'ArtistInfo',
      component: ArtistInfoView,
      props: true
    }
  ]
})
