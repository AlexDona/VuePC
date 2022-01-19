<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <div v-if="logo" class="sidebar-logo">
          <img :src="logo">
        </div>
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div v-if="logo" class="sidebar-logo">
          <img :src="logo">
        </div>
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>
<script>
import { getDefaultConfig } from '@/utils/auth'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '',
      logo: require('@/assets/wxskLogo.png')
    }
  },
  created() {
    if (getDefaultConfig().pcLogoPath) {
      this.logo = process.env.NODE_ENV === 'development'
        ? process.env.VUE_APP_BASE_REQUESTURL + getDefaultConfig().pcLogoPath
        : getDefaultConfig().pcLogoPath
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 80px;
  // line-height: 80px;
  background: #fff;
  text-align: center;
  overflow: hidden;
  & .sidebar-logo-link {
    height: 80%;
    width: 100%;
    vertical-align: middle;
    text-align: center;
    & .sidebar-logo {
      width: 210px;
      height: 80px;
      // margin-right: 20px;
      padding: 10px 20px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 80px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.sidebar-logo-container.collapse .sidebar-logo{
  margin-right: 0;
}
</style>
