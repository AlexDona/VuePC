<template>
  <el-row :gutter="10">
    <el-col :span="9">
      <el-form-item
        :rules="getRules('province')"
        :label="label"
        :prop="getLabel + 'Province'"
      >
        <el-select
          v-model="childProvince"
          placeholder="请选择"
          class="selectStyle"
          :disabled="isDisabled"
          @change="fetchCities"
        >
          <el-option
            v-for="item in provinces"
            :key="item.provinceId"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item
        :rules="getRules('city')"
        :prop="getLabel + 'City'"
        label-width="10"
      >
        <el-select
          v-model="childCity"
          placeholder="请选择"
          class="selectStyle"
          :disabled="isDisabled"
          @change="fetchRegions"
        >
          <el-option
            v-for="item in cities"
            :key="item.cityId"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item
        :rules="getRules('region')"
        :prop="getLabel + 'Region'"
        label-width="10"
      >
        <el-select
          v-model="childRegion"
          placeholder="请选择"
          class="selectStyle"
          :disabled="isDisabled"
          @change="selectRegion"
        >
          <el-option
            v-for="item in regions"
            :key="item.countyId"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item
        :rules="getRules('addr')"
        :prop="getLabel + 'Addr'"
        label-width="10"
      >
        <el-tooltip placement="top-end" :open-delay="500" :disabled="!childAddr" :content="childAddr">
          <el-input v-model="childAddr" maxlength="50" :disabled="isDisabled " @change="inputAddr" />
          <!--  <div slot="content" class="content" v-html="childAddr" />
          <div class="childAddr">  {{ childAddr }} </div> -->
        </el-tooltip>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import {
  fetchCitiesWithCode,
  fetchRegionsWithCode,
  fetchProvinces
} from '@/api/customer'
// import { fetchProvinces, fetchCitiesWithCode } from '@/api/customer'
export default {
  name: 'Address',
  directives: {
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    province: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    region: {
      type: String,
      default: ''
    },
    addr: {
      type: String,
      default: ''
    },
    permissionValue: {
      type: [String, Object],
      default: 'none'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isInputDisabled: {
      // 控制单个输入框是否可以编辑 （true 可编辑  false 不可编辑）
      type: Boolean,
      default: false
    }
    // provinces: {
    //   type: Array,
    //   default: function() {
    //     return [];
    //   }
    // }
  },
  data() {
    return {
      /* permissionState: '', */
      rules: {
        province: [
          { required: true, message: '请填写必填项', trigger: 'blur' }
        ],
        city: [{ required: true, message: '请填写必填项', trigger: 'blur' }],
        region: [{ required: true, message: '请填写必填项', trigger: 'blur' }],
        addr: [{ required: true, message: '请填写必填项', trigger: 'blur' }]
      },
      provinces: [],
      cities: [],
      regions: [],
      childProvince: '',
      childCity: '',
      childRegion: '',
      childAddr: ''
    }
  },
  computed: {
    getLabel() {
      return this.label === '收件地址' ? 'receive' : 'registered'
    }
  },
  watch: {
    province: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.childProvince = newVal
        if (newVal) {
          fetchCitiesWithCode({
            provinceName: newVal
          }).then(response => {
            this.cities = response.data
          })
        } else {
          this.childProvince = ''
          this.childCity = ''
          this.childRegion = ''
          this.childAddr = ''
        }
      }
    },
    city: {
      deep: true,
      handler: function(newVal, oldVal) {
        if (
          this.province != null &&
          newVal != null &&
          this.province !== '' &&
          newVal !== ''
        ) {
          this.childCity = newVal
          fetchRegionsWithCode({
            cityName: newVal,
            provinceName: this.province
          }).then(response => {
            this.regions = response.data
          })
        }
      }
    },
    region: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.childRegion = newVal
      }
    },
    addr: {
      deep: true,
      handler: function(newVal, oldVal) {
        // 这里做特殊处理，防止数据根据页面不刷新
        if (newVal) {
          if (newVal.indexOf('|') !== -1) {
            const str = newVal.substr(0, newVal.indexOf('|'))
            this.childAddr = str
          } else {
            this.childAddr = newVal
          }
        }
      },
      immediate: true
    }
  },
  created() {
    fetchProvinces().then(response => {
      // debugger
      this.provinces = response.data
    })
  },
  methods: {
    getRules(key) {
      if (this.label === '收件地址' || this.label === '注册地址') {
        return this.rules[key]
      } else {
        return []
      }
    },
    fetchCities(item) {
      this.$emit('update:province', item)
      this.$emit('update:city', '')
      this.$emit('update:region', '')
      this.childCity = null
      this.childRegion = null
      this.childAddr = ''
      /* if (this.childProvince != null && this.childProvince !== '') {
        fetchCitiesWithCode({ provinceName: this.childProvince }).then(
          response => {
            this.cities = response.data
          }
        )
      } */
    },
    fetchRegions(item) {
      this.$emit('update:city', item)
      this.$emit('update:region', '')
      this.childRegion = null
      this.childAddr = ''
      /* if (
        this.childProvince != null &&
        this.childCity != null &&
        this.childProvince !== '' &&
        this.childCity !== ''
      ) {
        fetchRegionsWithCode({
          cityName: this.childCity,
          provinceName: this.childProvince
        }).then(response => {
          this.regions = response.data
        })
      } */
    },
    selectRegion(item) {
      this.$emit('update:region', item)
      this.childAddr = ''
    },
    inputAddr(item) {
      this.$emit('update:addr', item)
    }
  }
}
</script>
<style>
/* 单独设置 el-tooltip 的宽度
   warning：修改vue组件样式不能使用scoped 除此之外可以将其设置为全局数据
*/
.el-tooltip__popper {
  max-width: 180px;
}
</style>
<style lang="scss" scoped>
.selectStyle {
  width: 100%
}
/* .el-tooltip {
  width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
} */
</style>
