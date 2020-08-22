<template>
  <v-layout justify-center>
    <div class="page-width">
      <div class="all-product">{{ tenDanhMuc }}</div>
      <v-progress-linear color="green darken-2" rounded value="100"></v-progress-linear>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <div
        style="margin-top: 50px; display: flex; flex-direction: row-reverse; flex-wrap: wrap;"
        v-else
      >
        <v-card
          class="mx-auto san-pham"
          v-for="sanPham in sanPhams"
          :key="sanPham.id"
          style="margin-bottom: 40px"
        >
          <NuxtLink :to="'/sanpham/' + sanPham.id">
            <v-img
              :src="
                sanPham.anh_dai_dien
                  ? END_POINT_IMAGE + sanPham.anh_dai_dien
                  : product
              "
              width="100%"
              height="200"
            ></v-img>
            <v-card-title style="height: 95px">
              {{
              sanPham.ten_san_pham
              }}
            </v-card-title>
            <v-card-subtitle>{{ formatCurrency(sanPham.gia_ban) }} VNĐ</v-card-subtitle>
            <!-- <v-card-actions>
              <v-btn class="ma-1 mt-0" outlined color="green">
                <v-icon left>mdi-cart</v-icon>THÊM VÀO GIỎ
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>-->
          </NuxtLink>
        </v-card>
      </div>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="total_page"
          circle
          @input="PaginateSanPham"
          :total-visible="9"
        ></v-pagination>
      </div>
    </div>
  </v-layout>
</template>

<script>
import api from "@/api";
import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
export default {
  data: () => ({
    sanPhams: [{ danh_muc: { ten_danh_muc: "Danh mục" } }],
    danhMucs: [],
    tenDanhMuc: "",
    END_POINT_IMAGE: END_POINT_IMAGE,
    page: 1,
    per_page: 20,
    total_page: 1,
    loadSanPham: true,
    product: product,
  }),
  watch: {
    $route(to, from) {
      this.getSanPham();
      this.getDanhMuc();
    },
  },
  mounted() {
    this.getSanPham();
    this.getDanhMuc();
  },
  methods: {
    async getSanPham() {
      this.loadSanPham = true;
      let data = await api.get("sanpham", {
        danh_muc_id: this.$route.params.id,
        per_page: this.per_page,
        page: this.page,
      });
      this.sanPhams = data.data.data.data;
      this.total_page = data.data.data.last_page;
      this.page = data.data.data.current_page;
      this.loadSanPham = false;
    },
    addGioHang(id) {
      let product = JSON.parse(localStorage.getItem("gio_hang"));
      if (!product) {
        product = [];
      }
      let sP = {};
      let check = product.find((el) => el.san_pham_id == id);
      if (check) {
        check.so_luong = check.so_luong + 1;
      } else {
        sP.so_luong = 1;
        sP.san_pham_id = id;
        product.push(sP);
      }

      let so_luong = 0;
      for (let item of product) {
        so_luong = Number(so_luong) + Number(item.so_luong);
      }
      this.snackbar = true;
      this.noiDung = "Đã thêm vào giỏ hàng";
      this.$store.commit("giohang/add", so_luong);
      localStorage.setItem("gio_hang", JSON.stringify(product));
    },
    async getDanhMuc() {
      let data = await api.get("danhmuc");
      this.tenDanhMuc = data.data.data.find(
        (el) => el.id == this.$route.params.id
      ).ten_danh_muc;
    },
    PaginateSanPham(val) {
      this.page = val;
      this.getSanPham();
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
  },
};
</script>
<style scoped>
.danh-muc {
  font-size: 14px;
  font-weight: bold;
  margin-left: 15px;
}
.text-icon {
  font-size: 16px;
  font-weight: bold;
  padding-left: 15px;
}
.san-pham {
  max-width: 250px;
}
.all-product {
  margin-top: 50px;
  font-size: 26px;
  font-weight: bold;
}
@media only screen and (max-width: 600px) {
  .san-pham {
    max-width: 170px;
  }
  .all-product {
    font-size: 24px;
    margin-left: 10px;
  }
}
</style>
