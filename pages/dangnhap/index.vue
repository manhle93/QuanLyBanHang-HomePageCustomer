<template>
  <v-layout justify-center>
    <div class="page-width d-flex" style="justify-content: center">
      <v-snackbar top color="pink" v-model="snackbar">{{thongBao}}</v-snackbar>
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="green" dark flat>
            <v-toolbar-title>Đăng nhập</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <label class="labelForm">Tên đăng nhập</label>
              <v-text-field
                prepend-inner-icon="mdi-account"
                class="mt-3"
                name="login"
                outlined
                dense
                type="E-Mail"
                v-model="form.username"
                placeholder="Nhập tên đăng nhập"
                :rules="emailRules"
              ></v-text-field>
              <label class="labelForm">Mật khẩu</label>
              <v-text-field
                prepend-inner-icon="mdi-lock"
                class="mt-3"
                id="password"
                outlined
                dense
                name="Mật khẩu"
                v-model="form.password"
                type="password"
                placeholder="Nhập mật khẩu"
                :rules="passwordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions style="padding-bottom: 30px; text-align:center">
            <v-btn
              color="green"
              style="width: 100%; border-radius: 50px; color: white; font-weight: bold"
              @click="login"
            >Đăng nhập</v-btn>
          </v-card-actions>
          <div style="text-align: center; padding-bottom: 20px">
            <div style="font-size: 16px; padding-bottom: 10px">Bạn chưa có tài khoản ?</div>
            <nuxt-link to="/dangky">
              <div style="font-size: 18px; font-weight: bold">Đăng ký</div>
            </nuxt-link>
          </div>
        </v-card>
      </v-col>
    </div>
  </v-layout>
</template>

<script>
import api from "@/api";
export default {
  layout: "header",
  data: () => ({
    valid: true,
    form: {
      username: "",
      password: "",
      thongBao: "",
    },
    loggedIn: false,
    snackbar: false,
    thongBao: "",
    passwordRules: [
      (v) => !!v || "Mật khẩu không thể bỏ trống",
      (v) => (v && v.length >= 6) || "Mật khẩu tối thiểu 6 ký tự",
    ],
    email: "",
    emailRules: [(v) => !!v || "Tên đăng nhập Không thể bỏ trống"],
  }),
  created() {
    this.me();
  },
  methods: {
    async me() {
      try {
        let data = await api.get("auth/me");
        this.$router.push("/");
      } catch (error) {
        this.loggedIn = false;
      }
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async login() {
      if (this.$refs.form.validate()) {
        try {
          let data = await api.post("loginkhachhang", this.form);
          api.setToken(data.data.access_token);
          window.location.assign("/");
        } catch (error) {
          this.snackbar = true;
          this.thongBao = error.response.data.message;
        }
      } else {
        return console.log("Lỗi validate ", this.$refs.form);
      }
    },
  },
};
</script>

<style>
.labelForm {
  font-size: 16px;
  font-weight: 600;
}
</style>