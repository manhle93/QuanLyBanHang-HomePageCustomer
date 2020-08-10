<template>
  <v-layout justify-center>
    <div class="page-width">
      <v-text-field color="success" v-if="load" loading disabled></v-text-field>
      <v-snackbar top color="success" v-model="snackbar">Đăng ký thành công</v-snackbar>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="green" dark flat>
              <v-toolbar-title style="font-size: 16px; font-weight: bold">ĐĂNG KÝ TÀI KHOẢN</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form">
                <label class="labelForm">Họ tên</label>
                <v-text-field
                  prepend-inner-icon="mdi-account"
                  class="mt-1"
                  name="ten"
                  outlined
                  dense
                  type="E-Mail"
                  v-model="form.ten"
                  placeholder="Nhập họ và tên người dùng"
                  :rules="nameRules"
                ></v-text-field>
                <label class="labelForm">Tên đăng nhập</label>
                <v-text-field
                  prepend-inner-icon="mdi-account"
                  class="mt-1"
                  name="username"
                  outlined
                  dense
                  type="E-Mail"
                  v-model="form.username"
                  placeholder="Tên đăng nhập"
                  :rules="usernameRules"
                ></v-text-field>
                <label class="labelForm">Số điện thoại</label>
                <v-text-field
                  prepend-inner-icon="mdi-phone"
                  class="mt-1"
                  name="so_dien_thoai"
                  outlined
                  dense
                  type="E-Mail"
                  v-model="form.so_dien_thoai"
                  placeholder="Nhập số điện thoại"
                  :rules="phoneRules"
                ></v-text-field>
                <label class="labelForm">Mật khẩu</label>
                <v-text-field
                  prepend-inner-icon="mdi-lock"
                  ref="password"
                  class="mt-1"
                  id="password"
                  outlined
                  dense
                  name="Mật khẩu"
                  v-model="form.password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  :rules="passwordRules"
                ></v-text-field>
                <label class="labelForm">Xác nhận mật khẩu</label>
                <v-text-field
                  height="100%"
                  prepend-inner-icon="mdi-lock"
                  class="mt-1"
                  id="password"
                  outlined
                  dense
                  name="Mật khẩu"
                  v-model="form.password_confirmation"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions style="padding-bottom: 10px; text-align:center; margin-top: -20px">
              <v-btn
                color="green"
                style="width: 100%; border-radius: 50px; color: white; font-weight: bold"
                @click="dangKy"
              >Đăng ký</v-btn>
            </v-card-actions>
            <div style="text-align: center; padding-bottom: 20px">
              <div style="font-size: 16px; padding-bottom: 10px">Bạn đã có tài khoản ?</div>
              <nuxt-link to="/dangnhap">
                <div style="font-size: 18px; font-weight: bold">Đăng nhập</div>
              </nuxt-link>
            </div>
          </v-card>
        </v-col>
      </v-row>
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
      ten: null,
      ma: "KH" + new Date().getTime(),
      so_dien_thoai: null,
      dia_chi: null,
      ngay_sinh: null,
      ghi_chu: null,
      ca_nhan: false,
      ma_so_thue: null,
      gioi_tinh: true,
      email: null,
      username: null,
      password: null,
      password_confirmation: null,
      anh_dai_dien: null,
      facebook: null,
      trang_thai: null,
      so_tai_khoan: null,
      so_du: null,
      chuyen_khoan_cuoi: null,
      giao_dich_cuoi: null,
      nhom_id: null,
      loai_thanh_vien_id: null,
      tin_nhiem: null,
      diem_quy_doi: null,
      tien_vay: null,
    },
    load: false,
    snackbar: false,
    usernameRules: [
      (v) => !!v || "Tên đăng nhập không thể bỏ trống",
      (v) => (v && v.length >= 4) || "Tên đăng nhập tối thiểu 4 ký tự",
    ],
    passwordRules: [
      (v) => !!v || "Mật khẩu không thể bỏ trống",
      (v) => (v && v.length >= 6) || "Mật khẩu tối thiểu 6 ký tự",
    ],
    nameRules: [
      (v) => !!v || "Tên không thể bỏ trống",
      (v) => (v && v.length >= 2) || "Tên tối thiểu 2 ký tự",
    ],
    phoneRules: [
      (v) => !!v || "Số điện thoại Không thể bỏ trống",
      (v) => (v && v.length == 10) || "Số điện thoại không hợp lệ",
    ],
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
    async dangKy() {
      if (this.$refs.form.validate()) {
        try {
          this.form.email = this.form.username + "@email.com";
          this.load = true;
          let data = await api.post("khachhang", this.form);
          this.load = false;
          this.snackbar = true;
          setTimeout(() => {
            this.$router.push("/dangnhap");
          }, 3000);
        } catch (error) {
          this.load = false;
          console.log(error);
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
  font-size: 14px;
  font-weight: 600;
}
</style>