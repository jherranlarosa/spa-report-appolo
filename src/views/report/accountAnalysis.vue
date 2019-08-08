<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker class="filter-item" style="width: 110px" v-model="year" type="year" placeholder="Año" />

    <el-radio  class="filter-item"  v-model="alternativeMonth" label="1" border size="medium">Del Mes</el-radio>
    <el-radio  class="filter-item"  v-model="alternativeMonth" label="2" border size="medium">Al Mes</el-radio>

      
      <el-select class="filter-item" clearable style="width: 110px" v-model="listQuery.importance" placeholder="Seleccione un mes">
        <el-option v-for="item in month" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>


      <el-select class="filter-item" style="width: 110px" v-model="countSelect" filterable placeholder="Cuenta">
        <el-option
          v-for="item in counts"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-select class="filter-item" style="width: 145px" v-model="subCountSelect" filterable placeholder="Sub Cuenta">
        <el-option
          v-for="item in subCounts"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    <el-checkbox  class="filter-item"  v-model="allCounts" label="1" border size="medium">Todo (subcuentas)</el-checkbox>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" >Buscar</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">Exportar</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="Cargando :3 ..." border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'Other Date :)'">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Detalle">
        <template slot-scope="scope">
          <span v-if="scope.row.pageviews" class="link-type" >{{scope.row.pageviews}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"  >{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='published'" size="mini" type="success" >{{$t('table.publish')}}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" >{{$t('table.draft')}}
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" >{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background  :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max='3'></el-rate>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button >{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" >{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" >{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" >{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
/* eslint-disable */
import {getListReport} from '@/api/report'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
        allCounts: '',
        counts: [{
          value: 'Cuenta 01',
          label: 'Cuenta 01'
        }, {
          value: 'Cuenta 02',
          label: 'Cuenta 02'
        }, {
          value: 'Cuenta 03',
          label: 'Cuenta 03'
        }, {
          value: 'Cuenta 04',
          label: 'Cuenta 04'
        }, {
          value: 'Cuenta 05',
          label: 'Cuenta 05'
        }],
        countSelect: '',
        subCountSelect: '',
        subCounts: [{
          value: 'Sub Cuenta 01',
          label: 'Sub Cuenta 01'
        }, {
          value: 'Sub Cuenta 02',
          label: 'Sub Cuenta 02'
        }, {
          value: 'Sub Cuenta 03',
          label: 'Sub Cuenta 03'
        }, {
          value: 'Sub Cuenta 04',
          label: 'Sub Cuenta 04'
        }, {
          value: 'Sub Cuenta 05',
          label: 'Sub Cuenta 05'
        }],
        alternativeMonth: '1',
      year: ' ',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      month: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.getList() 
  },
  methods: {
    getList() {
      this.listLoading = false

     return new Promise((resolve, reject) => {
        getListReport()
          .then(response => {
           this.$message({
                    message: 'El api respondio correctamente :3',
                    type: 'success',
                    duration: 3000
            })
             resolve(true)
          })
          .catch(err => {
            console.log(err)
          })
      })


    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
