<script setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getCarInfo , deleteCarInfo} from '../api/car'
import { InfoFilled, Delete, Check, Search, Close} from '@element-plus/icons-vue'


const carModel = ref({
    identification_number: "",
    license_plate_number: "",
    color: "",
    vehicle_type: "",
    client_number: null,
    client_name: "",
    client_contact_number: ""
})

const carLoading = ref(false)
const carTotal = ref(0)
const carCurrentPage = ref(1)
const carPageSize = ref(10)

const onSizeChange = async (val) => {
    carPageSize.value = val
    carSearch()
}

const onCurrentChange = async (val) => {
    carCurrentPage.value = val
    carSearch()
}

const carSearch = async () => {
    carLoading.value = true
    let params = {
        pageNum : carCurrentPage.value ? carCurrentPage.value : 1,
        pageSize : carPageSize.value ? carPageSize.value : 10,
        identification_number: carModel.value.identification_number ? carModel.value.identification_number : null,
        license_plate_number: carModel.value.license_plate_number ? carModel.value.license_plate_number : null,
        color: carModel.value.color ? carModel.value.color : null,
        vehicle_type: carModel.value.vehicle_type ? carModel.value.vehicle_type : null,
        client_number: carModel.value.client_number ? carModel.value.client_number : null,
        client_name: carModel.value.client_name ? carModel.value.client_name : null,
        client_contact_number: carModel.value.client_contact_number ? carModel.value.client_contact_number : null
    }
    let res = await getCarInfo(params)
    carList.value = res.data.data.items
    carTotal.value = res.data.data.total
    carLoading.value = false
}

const deleteCar = (deletenumber) => {
    let params = {
        identification_number: deletenumber
    }
    deleteCarInfo(params).then(res => {
        carSearch()
    })
}

const carList = ref([{
    identification_number: "",
    license_plate_number: "",
    color: "",
    vehicle_type: "",
    client_number: null,
    client_name: "",
    client_contact_number: ""
}])

carSearch()

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>车辆管理</span>
            </div>
        </template>
        <el-form inline>
            <el-form-item label="车型：">
                <el-input name="vehicle_type" placeholder="请输入车型" v-model.trim="carModel.vehicle_type"></el-input>
            </el-form-item>
            <el-form-item label="联系人：">
                <el-input name="contactName" placeholder="请输入联系人" v-model.trim="carModel.client_name"></el-input>
            </el-form-item>
            <el-form-item label="车牌号：">
                <el-input name="license_plate_number" placeholder="请输入车牌号"
                    v-model.trim="carModel.license_plate_number"></el-input>
            </el-form-item>
            <el-form-item label="车架号：">
                <el-input name="identification_number" placeholder="请输入车架号"
                    v-model.trim="carModel.identification_number"></el-input>
            </el-form-item>
            <el-form-item label="颜色：">
                <el-input name="color" placeholder="请输入颜色" v-model.trim="carModel.color"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :icon="Search" circle @click="carSearch" />
                <el-button type="info" :icon="Close" circle
                    @click="carModel.vehicle_type = ''; carModel.client_name = ''; carModel.license_plate_number = ''; carModel.identification_number = ''; carModel.color = ''; carSearch()" />
            </el-form-item>
        </el-form>

        <el-table v-loading="carLoading" :data="carList" style="width: 100%"
            :row-key="row => row.identification_number">
            <<el-table-column label="车架号" prop="identification_number"></el-table-column>
                <el-table-column label="车牌号" prop="license_plate_number"></el-table-column>
                <el-table-column label="车型" prop="vehicle_type"></el-table-column>
                <el-table-column label="颜色" prop="color"></el-table-column>
                <el-table-column label="操作" width="110" header-align="center">
                    <template #default="{ row: car }">
                        <el-popover placement="right" :width="380" trigger="hover">
                            <template #reference>
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                            </template>
                            <el-card style="max-width: 480px" shadow="always">
                                <template #header>
                                    <div>车牌名：{{ car.identification_number }}</div>
                                </template>
                                <p>车架号：{{ car.identification_number }}</p>
                                <p>颜色：{{ car.color }}</p>
                                <p>车型：{{ car.vehicle_type }}</p>
                                <p>联系人姓名：{{ car.client_name }}</p>
                                <template #footer>联系电话：{{ car.client_contact_number }}</template>
                            </el-card>
                        </el-popover>
                        <el-button :icon="Delete" circle plain type="danger"
                            @click="deleteCar(car.identification_number)"></el-button>
                    </template>
                </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="carCurrentPage" v-model:page-size="carPageSize"
            :page-sizes="[3, 5, 10, 15]" layout="jumper, total, sizes, prev, pager, next" background :total="carTotal"
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