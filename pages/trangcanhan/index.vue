<template>
  <v-layout justify-center>
    <v-snackbar v-model="snackbar" :color="color">
      {{ noiDung }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
      </template>
    </v-snackbar>
    <div class="page-width">
      <div
        class="image-cover avatar mt-3"
        style="max-width: 100%; height: 300px; background: url('https://res.cloudinary.com/dsobei3hp/image/upload/v1608782360/GitHub/043552009311f5b53aec70d9d354c0f5_uk9vup.jpg')"
      >
        <a>
          <v-avatar
            size="200"
            style="margin-bottom: -60px; border: 4px solid white"
            @click="handleUpload"
          >
            <img
              :src="User.user.avatar_url ? END_POINT_IMAGE + User.user.avatar_url : avatar"
              alt="John"
            />
          </v-avatar>
        </a>

        <input ref="upload-image" style="display: none" type="file" @change="handleChange($event)" />
        <div class="name">{{User.ten}}</div>
      </div>
      <!-- <v-card style="background-color: #1A237E">
        <v-img
          height="230px"
          src="https://i.pinimg.com/originals/46/37/5b/46375b7d7d510611ed88ec2bace087a1.png"
        >
          <v-card-text>
            <v-layout column>
              <a>
                <v-avatar
                  size="200"
                  style="margin-bottom: -60px; border: 4px solid white"
                  @click="handleUpload"
                >
                  <img
                    :src="
                      User.user.avatar_url
                        ? END_POINT_IMAGE + User.user.avatar_url
                        : avatar
                    "
                    alt="John"
                  />
                </v-avatar>
              </a>
            </v-layout>
          </v-card-text>
          <input
            ref="upload-image"
            style="display: none"
            type="file"
            @change="handleChange($event)"
          />
        </v-img>
        <div class="name" style="margin-left: 50px">{{ User.ten }}</div>
      </v-card> -->

      <div class="d-flex" style="justify-content: center">
        <div class="mobile-name">{{ User.ten }}</div>
      </div>
      <div
        style="width: 100%; display: flex;flex-direction: row; flex-wrap: wrap; justify-content: center"
      >
        <div style="width: 400px; min-height: 600px;">
          <div class="c-flex thongtin-canhan">
            <div class="tieude">THÔNG TIN CÁ NHÂN</div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-email</v-icon>
              Email: {{ User.user.email }}
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-account</v-icon>
              Tên đăng nhập: {{ User.user.username }}
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-phone</v-icon>
              SĐT: {{ User.so_dien_thoai }}
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-calendar</v-icon>
              Ngày sinh: {{ User.ngay_sinh }}
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-human</v-icon>
              Giới tính: {{ User.gioi_tinh ? "Nam" : "Nữ" }}
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-code-brackets</v-icon>
              Mã số thuế: {{ User.ma_so_thue }}
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-map-marker</v-icon>
              Địa chỉ: {{ User.dia_chi }}
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-facebook</v-icon>
              Facebook: {{ User.facebook }}
            </div>
            <div class="tieude mt-4">TÀI KHOẢN THANH TOÁN</div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-barcode</v-icon>
              Số tài khoản: {{ User.so_tai_khoan }}
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-checkbox-marked-circle-outline</v-icon>
              Số dư: {{ formatCurrency(User.so_du) }} đ
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-pencil</v-icon>
              Tiền vay: {{ User.tien_vay }}
            </div>
            <div class="mb-2">
              <v-icon class="mr-3">mdi-calendar</v-icon>
              Giao dịch cuối: {{ formatDatetime(User.giao_dich_cuoi) }}
            </div>
            <v-btn class="mt-3 mb-2 mr-6" color="teal" dark>
              <v-icon class="mr-3" small>mdi-book-open-variant</v-icon>Báo cáo
            </v-btn>
            <v-btn
              class="mt-3 mb-3 mr-6"
              color="indigo"
              dark
              @click="showUpdate"
            >
              <v-icon class="mr-3" small>mdi-pencil</v-icon>Cập nhật thông tin
            </v-btn>
            <v-btn
              class="mt-1 mb-3 mr-6"
              color="green"
              dark
              @click="showChangePass"
            >
              <v-icon class="mr-3" small>mdi-lock</v-icon>Đổi mật khẩu
            </v-btn>
          </div>

          <div
            class="c-flex thongtin-canhan mb-4 overflow-y-auto"
            style="margin-top: 15px; padding-left: 0px; max-height:600px"
          >
            <div class="tieude ml-6">LỊCH SỬ GIAO DỊCH</div>
            <v-list-item v-for="item in giaoDich" :key="item.id">
              <v-btn
                v-if="item.trang_thai == 'nop_tien'"
                class="mx-2"
                fab
                dark
                small
                color="green"
              >
                <v-icon dark>mdi-database-plus</v-icon>
              </v-btn>
              <v-btn
                v-if="item.trang_thai == 'mua_hang'"
                class="mx-2"
                fab
                dark
                small
                color="primary"
              >
                <v-icon dark>mdi-cart-plus</v-icon>
              </v-btn>
              <v-btn
                v-if="item.trang_thai == 'hoan_tac_nop_tien'"
                class="mx-2"
                fab
                dark
                small
                color="pink"
              >
                <v-icon dark>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                v-if="item.trang_thai == 'hoan_tien'"
                class="mx-2"
                fab
                dark
                small
                color="warning"
              >
                <v-icon dark>mdi-cash</v-icon>
              </v-btn>
              <v-list-item-content>
                <v-list-item-title v-if="item.trang_thai == 'mua_hang'"
                  >Giao dịch mua hàng</v-list-item-title
                >
                <v-list-item-title v-if="item.trang_thai == 'nop_tien'"
                  >Nộp tiền vào tài khoản</v-list-item-title
                >
                <v-list-item-title v-if="item.trang_thai == 'hoan_tac_nop_tien'"
                  >Hoàn tác nộp tiền</v-list-item-title
                >
                <v-list-item-title v-if="item.trang_thai == 'hoan_tien'"
                  >Hoàn tiền mua hàng</v-list-item-title
                >
                <v-list-item-subtitle>{{
                  formatDatetime(item.created_at)
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <h4>
                  {{
                    +item.so_tien > 0
                      ? "+" + formatCurrency(item.so_tien)
                      : formatCurrency(item.so_tien)
                  }}
                  đ
                </h4>
              </v-list-item-action>
            </v-list-item>
          </div>
        </div>

        <div
          id="scroll-target"
          class="flex-fill don-hang pl-4 pb-8 pr-4"
          style="min-height: 600px; background-color: #FEF5E7;"
          v-scroll="onScroll"
        >
          <div class="tieude mt-4 ml-10 mb-6">DANH SÁCH ĐƠN ĐẶT HÀNG</div>

          <v-card v-for="(item, index) in donHangs" :key="item.id" class="pb-4">
            <div style="font-weight: bold" class="mt-6 d-flex pt-4 pl-4">
              <div>{{ index + 1 }}. Mã đơn: {{ item.ma }}</div>
              <div class="flex-fill">
                <v-btn
                  v-if="item.trang_thai == 'moi_tao'"
                  class="ml-3"
                  small
                  outlined
                  color="indigo"
                  >Mới tạo</v-btn
                >
                <v-btn
                  v-if="item.trang_thai == 'mua_hang_online'"
                  class="ml-3"
                  small
                  outlined
                  color="indigo"
                  >Đơn mua hàng</v-btn
                >
                <v-btn
                  v-if="item.trang_thai == 'dat_hang_online'"
                  class="ml-3"
                  small
                  outlined
                  color="cyan "
                  >Đơn đặt trước</v-btn
                >
                <v-btn
                  v-if="item.trang_thai == 'hoa_don'"
                  class="ml-3 mr-2"
                  small
                  outlined
                  color="green"
                  >Đã thanh toán</v-btn
                >
                <v-btn
                  v-if="item.trang_thai == 'khach_huy'"
                  class="ml-3 mr-3"
                  small
                  outlined
                  color="purple"
                  >Đã hủy đơn</v-btn
                >
                <v-btn
                  v-if="item.trang_thai == 'huy_hoa_don'"
                  class="ml-3 mr-3"
                  small
                  outlined
                  color="warning"
                  >Hủy hóa đơn</v-btn
                >
                <v-btn
                  v-if="item.trang_thai == 'huy_bo'"
                  class="ml-3 mr-3"
                  small
                  outlined
                  color="pink"
                  >Admin hủy đơn</v-btn
                >
              </div>
              <div>
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="mx-4"
                      fab
                      dark
                      x-small
                      color="pink"
                      v-if="
                        item.trang_thai == 'moi_tao' ||
                          item.trang_thai == 'mua_hang_online' ||
                          item.trang_thai == 'dat_hang_online'
                      "
                      @click="huyDon(item.id)"
                    >
                      <v-icon dark>mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span>Hủy đơn</span>
                </v-tooltip>
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="mr-12"
                      fab
                      dark
                      x-small
                      color="indigo"
                      v-if="item.trang_thai == 'hoa_don'"
                      @click="inHoaDon(item.id)"
                    >
                      <v-icon dark>mdi-cloud-print</v-icon>
                    </v-btn>
                  </template>
                  <span>In hóa đơn</span>
                </v-tooltip>
              </div>
            </div>
            <div class="ml-4 mt-3" style="font-size: 15px">
              <v-icon class="mr-1">mdi-calendar-clock</v-icon>
              Thời gian: {{ formatDatetime(item.created_at) }}
            </div>
            <v-simple-table class="mb-4">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Sản phẩm</th>
                    <th class="text-left">Số lượng</th>
                    <th class="text-left">Đơn giá</th>
                    <th class="text-left">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sanpham in item.san_phams" :key="sanpham.id">
                    <td>
                      <v-avatar class="mr-4 anhsanpham mt-2 mb-2">
                        <img
                          :src="
                            sanpham.san_pham
                              ? END_POINT_IMAGE + sanpham.san_pham.anh_dai_dien
                              : product
                          "
                          alt="John"
                        />
                      </v-avatar>
                      {{ sanpham.san_pham.ten_san_pham }}
                    </td>
                    <td>
                      {{ sanpham.so_luong }} {{ sanpham.san_pham.don_vi_tinh }}
                    </td>
                    <td>{{ formatCurrency(sanpham.gia_ban) }} đ</td>
                    <td>
                      {{ formatCurrency(sanpham.gia_ban * sanpham.so_luong) }} đ
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div class="tien">
              Tổng tiền: {{ formatCurrency(item.tong_tien) }} đ
            </div>
            <div class="tien">
              Giảm giá: {{ formatCurrency(item.giam_gia) }} đ
            </div>
            <div class="tien">
              Thanh toán:
              {{ formatCurrency(+item.tong_tien - +item.giam_gia) }} đ
            </div>
          </v-card>
          <v-progress-linear
            v-show="loadMore"
            indeterminate
            color="green"
          ></v-progress-linear>
          <div class="mt-4 text-center" v-if="!all">
            <v-btn @click="getDonHang()" color="primary" dark>XEM THÊM</v-btn>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="dialogInFo" max-width="500">
      <v-card>
        <v-card-title class="headline">Cập nhật thông tin</v-card-title>
        <v-form ref="form" class="pl-4 pr-4">
          <label class="labelForm">Họ tên</label>
          <v-text-field
            prepend-inner-icon="mdi-account"
            class="mt-1"
            name="ten"
            outlined
            dense
            type="E-Mail"
            v-model="form.ten"
            placeholder="Họ và tên"
            :rules="nameRules"
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
          <label class="labelForm">E-Mail</label>
          <v-text-field
            prepend-inner-icon="mdi-email"
            class="mt-1"
            name="so_dien_thoai"
            outlined
            dense
            type="E-Mail"
            v-model="form.email"
            placeholder="Địa chỉ email"
            :rules="emailRules"
          ></v-text-field>
          <label class="labelForm">Địa chỉ</label>
          <v-textarea
            height="80"
            prepend-inner-icon="mdi-map-marker"
            class="mt-1"
            outlined
            dense
            v-model="form.dia_chi"
            placeholder="Địa chỉ nhận hàng"
            :rules="diaChidRules"
          ></v-textarea>

          <label class="labelForm">Ngày sinh</label>
          <v-text-field
            prepend-inner-icon="mdi-calendar"
            class="mt-1"
            name="so_dien_thoai"
            outlined
            dense
            type="date"
            v-model="form.ngay_sinh"
            placeholder="Nhập ngày sinh"
          ></v-text-field>
          <label class="labelForm">Giới tính</label>
          <v-select
            v-model="form.gioi_tinh"
            dense
            :items="gioiTinh"
            label="Chọn giới tính"
            item-text="ten"
            item-value="id"
            solo
            prepend-inner-icon="mdi-human"
          ></v-select>
          <label class="labelForm">Facebook</label>
          <v-text-field
            prepend-inner-icon="mdi-facebook"
            class="mt-1"
            outlined
            dense
            type="E-Mail"
            v-model="form.facebook"
            placeholder="Link facebook"
          ></v-text-field>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogInFo = false"
            >Hủy bỏ</v-btn
          >
          <v-btn color="green darken-1" text @click="updateInfo()"
            >Cập nhật</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPass" max-width="500">
      <v-card>
        <v-card-title class="headline">Đổi mật khẩu</v-card-title>
        <v-form ref="formMK" class="pl-4 pr-4">
          <label class="labelForm">Mật khẩu hiện tại</label>
          <v-text-field
            prepend-inner-icon="mdi-lock"
            class="mt-1"
            name="ten"
            outlined
            dense
            type="password"
            v-model="pass.oldPassword"
            placeholder="Mật khẩu hiện tại"
            :rules="oldPassRules"
          ></v-text-field>
          <label class="labelForm">Mật khẩu mới</label>
          <v-text-field
            prepend-inner-icon="mdi-lock-outline"
            class="mt-1"
            outlined
            dense
            type="password"
            v-model="pass.newPassword"
            placeholder="Nhập mật khẩu mới"
            :rules="newPassRules"
          ></v-text-field>
          <label class="labelForm">Xác nhận mật khẩu mới</label>
          <v-text-field
            prepend-inner-icon="mdi-lock-outline"
            class="mt-1"
            outlined
            dense
            type="password"
            v-model="pass.reNewPassword"
            placeholder="Nhập lại mật khẩu mới"
            :rules="renewPassRules"
          ></v-text-field>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogPass = false"
            >Hủy bỏ</v-btn
          >
          <v-btn color="green darken-1" text @click="updatePass()"
            >Cập nhật</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import product from "@/assets/image/product.png";
import api from "@/api";
import avatar from "@/assets/image/avatar_none.png";
import { END_POINT_IMAGE, END_POINT } from "@/env";

export default {
  head: () => ({
    title: "Trang Cá Nhân"
  }),
  layout: "header",
  data: () => ({
    per_page: 3,
    page: 0,
    loadMore: true,
    all: false,
    isActive: false,
    avatar: avatar,
    snackbar: false,
    noiDung: "",
    giaoDich: [],
    END_POINT_IMAGE: END_POINT_IMAGE,
    donHangs: [],
    dialogPass: false,
    color: "green",
    pass: {
      oldPassword: null,
      newPassword: null,
      reNewPassword: null
    },
    User: {
      user: {}
    },
    gioiTinh: [
      { ten: "Nam", id: true },
      { ten: "Nữ", id: false }
    ],
    dialogInFo: false,
    form: {
      ten: "",
      so_dien_thoai: "",
      dia_chi: "",
      ngay_sinh: "",
      email: "",
      ma_so_thue: "",
      facebook: "",
      gioi_tinh: false
    },
    diaChidRules: [
      v => !!v || "Địa chỉ nhận hàng không thể bỏ trống",
      v => (v && v.length >= 6) || "Địa chỉ tối thiểu 6 ký tự"
    ],
    emailRules: [
      v => !!v || "Email không thể bỏ trống",
      v => /.+@.+\..+/.test(v) || "E-mail không hợp lệ"
    ],
    nameRules: [
      v => !!v || "Tên không thể bỏ trống",
      v => (v && v.length >= 2) || "Tên tối thiểu 2 ký tự"
    ],
    phoneRules: [
      v => !!v || "Số điện thoại Không thể bỏ trống",
      v => (v && v.length == 10) || "Số điện thoại không hợp lệ"
    ],
    oldPassRules: [v => !!v || "Mật khẩu cũ không thể bỏ trống"],
    newPassRules: [
      v => !!v || "Mật khẩu mới không thể bỏ trống",
      v => (v && v.length >= 6) || "Mật khẩu tối thiểu 6 ký tự"
    ],
    renewPassRules: [
      v => !!v || "Hãy nhập lại mật khẩu mới",
      v => (v && v.length >= 6) || "Tối thiểu 6 ký tự"
    ]
  }),
  mounted() {
    this.me();
    this.getDonHang();
  },
  watch: {
    isActive(val) {
      console.log(val);
    }
  },
  methods: {
    async me() {
      try {
        let data = await api.get("profilekhachhang");
        this.User = data.data.data;
        // this.donHangs = data.data.don_hang;
        this.giaoDich = data.data.giao_dich;
      } catch (error) {
        window.location.assign("/");
      }
    },
    async getDonHang() {
      this.page += 1;
      this.loadMore = true;
      let data = await api.get("donhangmobile", {
        per_page: this.per_page,
        page: this.page
      });
      if (this.page == data.data.last_page) {
        this.all = true;
      }
      this.loadMore = false;
      this.donHangs.push(...data.data.data);
    },
    onScroll(e) {
      // console.log(e);
      // if(e.target.scrollTop >= 1197){
      //   this.per_page = this.per_page +1
      //   this.getDonHang()
      // }
    },
    validate() {
      this.$refs.form.validate();
    },
    validatePass() {
      this.$refs.formMK.validate();
    },
    formatCurrency(n, separate = ".") {
      try {
        if (!n) n = 0;
        var s = parseInt(n).toString();
        var regex = /\B(?=(\d{3})+(?!\d))/g;
        var ret = s.replace(regex, separate);
        return ret;
      } catch (error) {
        return "0";
      }
    },
    inHoaDon(id) {
      window.open(END_POINT_IMAGE + "api/inhoadon/" + id, "_blank");
    },
    async huyDon(id) {
      try {
        let data = await api.post("khachhuy/" + id);
        this.snackbar = true;
        this.noiDung = "Hủy đơn thành công";
        this.me();
      } catch (error) {
        console.log(error);
      }
    },
    formatDatetime(time) {
      if (!time) {
        return "";
      }
      try {
        console.log(time)
        let d = new Date(time);
        let month = +d.getUTCMonth() + 1;
        let hours = +d.getHours();
        let min = +d.getMinutes();
        if (month < 10) {
          month = "0" + month;
        }
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (min < 10) {
          min = "0" + min;
        }
        return (
          hours +
          ":" +
          min +
          " Ngày " +
          d.getDate() +
          "/" +
          month +
          "/" +
          d.getUTCFullYear()
        );
      } catch (error) {
        return "";
      }
    },
    async updateInfo() {
      if (this.$refs.form.validate()) {
        try {
          let data = await api.post("capnhatkhachhang", this.form);
          this.snackbar = true;
          this.color = "green";
          this.noiDung = "Cập nhật thành công";
          this.dialogInFo = false;
          this.me();
        } catch (error) {
          this.snackbar = true;
          this.color = "pink";
          this.noiDung = error.response.data.message;
        }
      } else {
        return console.log("Lỗi validate ", this.$refs.form);
      }
    },
    async handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      try {
        let img = await api.post("avatarkhachhang", data);
        this.User.user.avatar_url = img.data.data;
      } catch (error) {
        this.snackbar = true;
        this.color = "pink";
        this.noiDung = "Không thể upload ảnh";
      }
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    showUpdate() {
      this.dialogInFo = true;
      this.form.ten = this.User.ten;
      this.form.so_dien_thoai = this.User.so_dien_thoai;
      this.form.email = this.User.email;
      this.form.ngay_sinh = this.User.ngay_sinh;
      this.form.dia_chi = this.User.dia_chi;
      this.form.facebook = this.User.facebook;
      this.form.gioi_tinh = this.User.gioi_tinh;
    },
    async updatePass() {
      if (this.$refs.formMK.validate()) {
        try {
          await api.post("changepasskhachhang", this.pass);
          this.snackbar = true;
          this.color = "green";
          this.noiDung = "Thay đổi mật khẩu thành công";
          this.dialogPass = false;
          setTimeout(() => {
            this.logOut();
          }, 1000);
        } catch (error) {
          this.dialogPass = false;
          this.snackbar = true;
          this.color = "pink";
          this.noiDung = error.response.data.message;
        }
      } else {
        return console.log("Lỗi validate ", this.$refs.formMK);
      }
    },
    showChangePass() {
      this.dialogPass = true;
      this.pass.oldPassword = null;
      this.pass.newPassword = null;
      this.pass.reNewPassword = null;
    },
    async logOut() {
      try {
        await api.post("auth/logout");
        api.deleteToken();
        // this.me();
        window.location.assign("/");
      } catch (error) {}
    }
  }
};
</script>
<style scoped>
.c-flex {
  display: flex;
  flex-direction: column;
}
.avatar {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  padding-left: 50px;
}
.name {
  font-size: 34px;
  font-weight: bold;
  color: white;
  margin-left: 30px;
  margin-bottom: 15px;
  text-shadow: 2px 2px black;
}
.mobile-name {
  display: none;
}
.thongtin-canhan {
  padding-top: 10px;
  padding-left: 30px;
  margin-top: 70px;
  border: 2px solid #229954;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-right: 30px;
}
.tieude {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.don-hang {
  height: 100%;
  border: 2px solid green;
  min-width: 300px;
  margin-top: 70px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.tien {
  font-size: 15px;
  margin-top: 8px;
  margin-left: 15px;
}
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
@media only screen and (max-width: 600px) {
  .avatar {
    display: flex;
    padding-left: 0px;
    justify-content: center;
    align-items: flex-end;
    margin-left: 10px;
    margin-right: 10px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  .name {
    display: none;
  }
  .mobile-name {
    display: flex;
    font-size: 34px;
    font-weight: bold;
    margin-top: 80px;
  }
  .thongtin-canhan {
    margin-top: 10px;
    margin-right: 0px;
  }
  .anhsanpham {
    display: none;
  }
  .don-hang {
    margin-top: 0px;
  }
}
</style>
