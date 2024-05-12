<script setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, Delete, Check, Search, Close} from '@element-plus/icons-vue'
import { getRepairmanInfo } from '../api/repairman'

const pageNum = ref(1)
const pageSize = ref(10)

const total = ref(0)
const loading = ref(false)
const repairmanModel = ref({
    jobs: null,
    number: null,
    repairman_name: null
})
const repairmanList = ref([])

const repairmanSearch = async () => {
    loading.value = true
    let params = {
        pageNum: pageNum.value ? pageNum.value : 1,
        pageSize: pageSize.value ? pageSize.value : 10,
        jobs: repairmanModel.value.jobs ? repairmanModel.value.jobs : null,
        number: repairmanModel.value.number ? repairmanModel.value.number : null
    }
    let res = await getRepairmanInfo(params)
    repairmanList.value = res.data.data.items
    total.value = res.data.data.total
    loading.value = false
}

const onSizeChange = async (val) => {
    pageSize.value = val
    repairmanSearch()
}
const onCurrentChange = async (val) => {
    pageNum.value = val
    repairmanSearch()
}

repairmanSearch()

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>员工查询</span>
            </div>
        </template>
        <el-form inline>
            <el-form-item label="员工编号：">
                <el-input name="vehicle_type" placeholder="请输入员工编号" v-model.trim="repairmanModel.number"></el-input>
            </el-form-item>
            <el-form-item label="工种：">
                <el-input name="contactName" placeholder="请输入员工工种" v-model.trim="repairmanModel.jobs"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :icon="Search" circle @click="repairmanSearch" />
                <el-button type="info" :icon="Close" circle
                    @click="repairmanModel.number=''; repairmanModel.jobs=''; repairmanSearch()" />
            </el-form-item>
        </el-form>
        <el-table :data="repairmanList" style="width: 100%">
            <el-table-column label="序号" type="index" width="100"></el-table-column>
            <el-table-column prop="number" label="员工编号" ></el-table-column>
            <el-table-column prop="jobs" label="工种" ></el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize"
            :page-sizes="[3, 5, 10, 15]" layout="jumper, total, sizes, prev, pager, next" background :total="total"
            @size-change="onSizeChange" @current-change="onCurrentChange"
            style="margin-top: 20px; justify-content: flex-end" />
    </el-card>  

</template>

<style lang="scss" scoped>
.page-container {
    // position: relative; /* 相对定位 */
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

// .pagination-container {
//     position: absolute; /* 绝对定位 */
//     bottom: 20px; /* 定位到底部 */
//     width: 100%; /* 宽度与父容器相同 */
// }
/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>