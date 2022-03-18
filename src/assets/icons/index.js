import Vue from 'vue';
import CSvgIcon from '@/components/common/CSvgIcon'; // svg component

// register globally
Vue.component('c-svg-icon', CSvgIcon);

const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
