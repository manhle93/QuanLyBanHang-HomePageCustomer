<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="leftMenu" app temporary>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="green" dark height="135">
      <div
        class="d-flex align-center flex-column"
        style="width: calc(100% + 32px); height: 100%; margin-left: -16px; margin-right: -16px; margin-bottom: -8px"
      >
        <div class="d-flex align-center page-width" style="height: 85px;">
          <v-app-bar-nav-icon
            @click.stop="leftMenu = !leftMenu"
            v-show="!$vuetify.breakpoint.lgAndUp"
          ></v-app-bar-nav-icon>
          <NuxtLink to="/">
            <v-toolbar-title>
              <img :src="logo" height="50" />
            </v-toolbar-title>
          </NuxtLink>
          <div class="flex-fill d-flex align-center" style="height: 100%; justify-content: center">
            <v-text-field
            light
              background-color="white"
              color="black"
              label="Tìm kiếm"
              solo
              hide-details
              style="max-width: 600px; border-radius: 50px"
              prepend-inner-icon="mdi-yeast"
            ></v-text-field>
          </div>

          <v-btn class="ma-2" outlined large fab color="white">
            <v-badge color="red" content="6">
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </v-btn>
        </div>
        <div
          class="flex-fill d-flex"
          style="background-color: #196F3D; width: 100%; justify-content: center"
        >
          <div
            class="page-width d-flex align-center"
            style="width: 250px; height: 100%; background-color: #F5B041"
          >
            <v-icon style="margin-left: 10px">mdi-menu</v-icon>
            <div style="margin-left: 10px">DANH MỤC</div>
          </div>
          <div class="page-width" style="width: 650px; height: 100%; background-color: #196F3D"></div>
          <div class="page-width" style="width: 300px; height: 100%; background-color: #196F3D"></div>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
    <!-- <v-footer color="indigo" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>-->
  </v-app>
</template>

<script>
import logo from "@/assets/image/logo.jpg";
export default {
  props: {
    source: String,
  },
  data: () => ({
    leftMenu: false,
    logo: logo,
  }),
  mounted() {},
};
</script>