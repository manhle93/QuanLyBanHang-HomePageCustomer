<template>
  <v-layout justify-center>
    <div class="page-width">
      <div class="all-product">SẢN PHẨM BÁN CHẠY</div>
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
          <NuxtLink :to="'/sanpham/' + sanPham.san_pham.id">
            <v-img
              :src="
                sanPham.san_pham.anh_dai_dien
                  ? END_POINT_IMAGE + sanPham.san_pham.anh_dai_dien
                  : product
              "
              width="100%"
              height="200"
            ></v-img>
            <v-card-title style="height: 95px">
              {{
              sanPham.san_pham.ten_san_pham
              }}
            </v-card-title>
            <v-card-subtitle>{{ formatCurrency(sanPham.san_pham.gia_ban) }} VNĐ</v-card-subtitle>
            <!-- <v-card-actions>
              <v-btn class="ma-1 mt-0" outlined color="green">
                <v-icon left>mdi-cart</v-icon>THÊM VÀO GIỎ
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>-->
          </NuxtLink>
        </v-card>
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
  },
  mounted() {
    this.getSanPham();
  },
  methods: {
    async getSanPham() {
      this.loadSanPham = true;
      let data = await api.get("sanphambanchaytrangchu", {
      });
      this.sanPhams = data.data;
      this.loadSanPham = false;
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
