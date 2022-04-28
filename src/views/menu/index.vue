<template>
    <div class="menu">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button
            @click="$router.push({name: 'menu-create'})">
            添加菜单
          </el-button>
        </div>
       <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="isLoading"
        >
          <el-table-column
            type="index"
            label="编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="菜单名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="level"
            label="菜单级数">
          </el-table-column>
          <el-table-column
            prop="icon"
            label="前端图标">
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="排序">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :disabled="isLoading">
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
import { getAllMenus, deleteMenuInfo } from '@/services/menu'
export default {
  name: 'MenuIndex',
  data () {
    return {
      tableData: [],
      current: 1,
      size: 10,
      total: 0,
      isLoading: false
    }
  },
  created () {
    this.loadAllMenu()
  },
  methods: {
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.size = val
      this.current = 1
      this.loadAllMenu()
    },
    // 页号改变触发
    handleCurrentChange (val) {
      this.current = val
      this.loadAllMenu()
    },
    async loadAllMenu () {
      this.isLoading = true
      const { data } = await getAllMenus({
        current: this.current,
        size: this.size
      })
      console.log(data)
      this.tableData = data.data.records
      this.total = data.data.total
      this.isLoading = false
    },
    handleEdit (rowData) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: rowData.id
        }
      })
    },
    handleDelete (rowData) {
      // 删除的确认提示
      this.$confirm('确定删除吗?', '删除提示')
        .then(async () => {
          // 发送删除请求
          const { data } = await deleteMenuInfo(rowData.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadAllMenu()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
