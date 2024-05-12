<script setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, Delete, Check, Search, Close, CircleCloseFilled, SuccessFilled, Plus } from '@element-plus/icons-vue'
import { getCarInfo } from '@/api/car'
import { getCustomerInfo } from '@/api/client'
import { getRepairInfo, getSpecific, getSpecificsByFaultNumber, addFaultInfo } from '@/api/repairInfo'

const carModel = ref({
    identification_number: "",
    license_plate_number: "",
    color: "",
    vehicle_type: "",
    client_number: null,
    client_name: "",
    client_contact_number: ""
})

const clientModel = ref({
    number: null,
    name: "",
    property: "",
    discount: null,
    contact_person: "",
    contact_number: ""
})

const faultLoading = ref(false)
const faultTotal = ref(0)
const faultAddVisible = ref(false)

const faultCurrentPage = ref(1)
const faultPageSize = ref(10)

const onSizeChange = async (val) => {
    faultPageSize.value = val
    faultSearch()
}

const onCurrentChange = async (val) => {
    faultCurrentPage.value = val
    faultSearch()
}

const faultModel = ref({
    number: null,
    identification_number: "",
    maintenance_type: "",
    work_type: "",
    billing_method: "",
    signature: "",
    damage_image: "",
    money: null,
    date: "",
    items: []
})

const faultFormModel = ref({
    number: null,
    identification_number: "",
    client_name: "",
    client_number: null
})

const faultSearch = async () => {
    faultLoading.value = true
    const faultItem = await getRepairInfo({
        pageNum: faultCurrentPage.value ? faultCurrentPage.value : 1,
        pageSize: faultPageSize.value ? faultPageSize.value : 10,
        identification_number: faultFormModel.value.identification_number ? faultFormModel.value.identification_number : null,
        number: faultFormModel.value.number ? faultFormModel.value.number : null,
        client_name: faultFormModel.value.client_name ? faultFormModel.value.client_name : null,
        client_number: faultFormModel.value.client_number ? faultFormModel.value.client_number : null
    })
    faultList.value = faultItem.data.data.items
    faultTotal.value = faultItem.data.data.total
    faultLoading.value = false
}


const faultAdd = () => {

    let params = {
        identification_number: faultModel.value.identification_number,
        maintenance_type: faultModel.value.maintenance_type,
        work_type: faultModel.value.work_type,
        billing_method: faultModel.value.billing_method,
        damage_image: faultModel.value.damage_image,
        items: faultModel.value.items
    }
    addFaultInfo(params)
    faultSearch().then(() => {
        faultCancel()
    })
}

const specific = ref([])
const percentage = ref(0)
const colors = ref([
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f7ad3', percentage: 100 },
])

const handleClose = () => {
    faultModel.value = {
        number: null,
        identification_number: "",
        maintenance_type: "",
        work_type: "",
        billing_method: "",
        signature: "",
        damage_image: "",
        money: null,
        date: "",
        items: []
    }
    carModel.value = {
        identification_number: "",
        license_plate_number: "",
        color: "",
        vehicle_type: "",
        client_number: null,
        client_name: "",
        client_contact_number: ""
    }
    clientModel.value = {
        number: null,
        name: "",
        property: "",
        discount: null,
        contact_person: "",
        contact_number: ""
    }
}

const InfoVisible = ref(false)

const showInfo = async () => {
    let params = {
        faultNumber: faultModel.value.number,
    }
    let res = await getSpecificsByFaultNumber(params)
    console.log(res)
    specific.value = res.data.data
    let countSpecific = specific.value.length
    let countDone = specific.value.reduce((acc, cur) => {
        if (cur.states === 'Done') {
            return acc + 1
        }
        return acc
    }, 0)
    percentage.value = 0
    params = {
        pageNum: 1,
        identification_number: faultModel.value.identification_number,
        pageSize: 1
    }
    res = await getCarInfo(params)
    carModel.value = res.data.data.items[0]

    params = {
        pageNum: 1,
        number: carModel.value.client_number,
        pageSize: 1
    }
    res = await getCustomerInfo(params)
    clientModel.value = res.data.data.items[0]

    setTimeout(() => {
        percentage.value = countDone / countSpecific * 100
    }, 1000)
    InfoVisible.value = true
}

const faultCancel = () => {
    faultModel.value = {
        number: null,
        identification_number: "",
        maintenance_type: "",
        work_type: "",
        billing_method: "",
        signature: "",
        damage_image: "",
        money: null,
        date: "",
        items: []
    }
    specific.value = []
    specificNumberList.value = []
    selectSpecific.value = []
    SpecificData.value = []
    faultAddVisible.value = false
}

const step = ref(1)
const faultList = ref([])
const specificNumberList = ref([])
const selectSpecific = ref([])
const SpecificData = ref([])
const faultAddForm = ref(null)

const checkFault = async () => {
    let params = {
        pageNum: 1,
        pageSize: 100
    }
    let resSpecific = await getSpecific(params)
    params = {
        pageNum: 1,
        identification_number: faultModel.value.identification_number ? faultModel.value.identification_number : null,
        pageSize: 100
    }
    let res = await getCarInfo(params)
    faultAddForm.value.validate((valid) => {
        if (valid) {
            console.log(res.data.data.total)
            if ((res.data.data.total === 0)) {
                ElMessage.error('车辆不存在, 请重新输入车辆号码')
            } else {
                step.value = 2
                SpecificData.value = resSpecific.data.data.items.map(item => {
                    return {
                        key: item.number,
                        label: item.name
                    }
                })
            }
        } else {
            ElMessage.error('请检查输入是否正确')
            return false
        }
    })
}

const filterMethod = (query, item) => {
    return item.label.indexOf(query) > -1
}

const rules = ref({
    identification_number: [
        { required: true, message: '请输入车架号', trigger: 'blur' }
    ],
    maintenance_type: [
        { required: true, message: '请选择维修类型', trigger: 'blur' }
    ],
    work_type: [
        { required: true, message: '请选择作业类型', trigger: 'blur' }
    ],
    billing_method: [
        { required: true, message: '请选择支付方式', trigger: 'blur' }
    ]
})

const checkSpecific = () => {
    if (selectSpecific.value.length === 0) {
        ElMessage.error('请选择故障')
    } else {
        faultModel.value.items = selectSpecific.value
        imageFlag.value = false
        step.value = 3
    }
}



const handleSuccess = (res) => {
    faultModel.value.damage_image = res.data
    console.log(res.data)
}

const imageFlag = ref(false)

faultSearch()
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>维修管理</span>
                <div class="extra">
                    <el-button type="primary" @click="faultAddVisible = true, step = 1">添加维修项目</el-button>
                </div>
            </div>
        </template>

        <el-dialog v-model="faultAddVisible" title="申请维修项目" width="800" @close="faultCancel">
            <div style="height: 130px">
                <el-steps :active="step">
                    <el-step title="信息录入" />
                    <el-step title="故障选择" />
                    <el-step title="定损图片上传" />
                    <el-step title="完成签名" />
                </el-steps>
            </div>

            <el-form :model="faultModel" label-width="200px" v-if="step === 1" :rules="rules" ref="faultAddForm">
                <el-form-item label="车架号" prop="identification_number">
                    <el-input v-model="faultModel.identification_number" style="width: 450px;"></el-input>
                </el-form-item>
                <el-form-item label="维修类型" prop="maintenance_type">
                    <el-select v-model.trim="faultModel.maintenance_type" placeholder="请输入类型" style="width: 450px;">
                        <el-option label="普通" value="普通" />
                        <el-option label="加急" value="加急" />
                    </el-select>
                </el-form-item>
                <el-form-item label="作业类型" prop="work_type">
                    <el-select v-model.trim="faultModel.work_type" placeholder="请输入类型" style="width: 450px;">
                        <el-option label="大修" value="大修" />
                        <el-option label="中修" value="中修" />
                        <el-option label="小修" value="小修" />
                    </el-select>
                </el-form-item>
                <el-form-item label="预计支付方式" prop="billing_method">
                    <el-select v-model.trim="faultModel.billing_method" placeholder="请输入方式" style="width: 450px;">
                        <el-option label="自付" value="自付" />
                        <el-option label="三包" value="三包" />
                        <el-option label="索赔" value="索赔" />
                    </el-select>
                </el-form-item>
            </el-form>

            <template v-if="step === 2">
                <el-transfer v-model="selectSpecific" filterable :filter-method="filterMethod"
                    filter-placeholder="请选择故障" :data="SpecificData" class="center-container" style="height: 300px;" />
            </template>

            <template v-if="step === 3">
                <el-upload class="upload-demo" drag action="http://localhost:8001/upload" :limit="1"
                    :on-success="handleSuccess">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        Drop file here or <em>click to upload</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            jpg/png files with a size less than 500kb
                        </div>
                    </template>
                </el-upload>
            </template>
            <template v-if="step === 4">
                <div class="center-container">
                    <el-progress type="circle" :percentage="100" status="success">
                        <el-button type="success" :icon="Check" circle />
                    </el-progress>
                </div>
                <div class="center-container">请注意提醒顾客注意微信信息完成签名，维修单申请结束</div>
            </template>
            <template #footer v-if="step === 1">
                <div class="dialog-footer">
                    <el-button @click="faultCancel">Cancel</el-button>
                    <el-button type="primary" @click="checkFault">Next</el-button>
                </div>
            </template>
            <template #footer v-if="step === 2">
                <div class="dialog-footer">
                    <el-button @click="faultCancel">Cancel</el-button>
                    <el-button type="primary" @click="checkSpecific">Next</el-button>
                </div>
            </template>
            <template #footer v-if="step === 3">
                <div class="dialog-footer">
                    <el-button @click="faultCancel">Cancel</el-button>
                    <el-button type="primary" @click="step = 4">Next</el-button>
                </div>
            </template>
            <template #footer v-if="step === 4">
                <div class="dialog-footer">
                    <el-button type="primary" @click="faultAdd(); faultSearch();">Confirm</el-button>
                </div>
            </template>


        </el-dialog>

        <el-drawer v-model="InfoVisible" title="维修详细信息" direction="rtl" size="60%"
            @close="handleClose(); InfoVisible = false">
            <div class="card-container">
                <el-card class="card">
                    <template #header>
                        <div class="header">
                            <span>客户信息</span>
                        </div>
                    </template>
                    <p>客户名：{{ clientModel.name }}</p>
                    <p>客户编号：{{ clientModel.number }}</p>
                    <p>客户性质：{{ clientModel.property }}</p>
                    <p>折扣：{{ clientModel.discount }}</p>
                    <p>联系人：{{ clientModel.contact_person }}</p>
                    <p>联系电话：{{ clientModel.contact_number }}</p>
                </el-card>
                <el-card class="card">
                    <template #header>
                        <div class="header">
                            <span>车辆信息</span>
                        </div>
                    </template>
                    <p>车架号：{{ carModel.identification_number }}</p>
                    <p>车牌号：{{ carModel.license_plate_number }}</p>
                    <p>颜色：{{ carModel.color }}</p>
                    <p>车辆类型：{{ carModel.vehicle_type }}</p>
                </el-card>
            </div>
            <div class="card-container">
                <el-card class="card">
                    <template #header>
                        <div class="header">
                            <span>客户签名</span>
                        </div>
                    </template>
                    <img v-if="faultModel.signature" :src="faultModel.signature"
                        style="width: 100%;height: 100%; margin: 5%" />
                    <img v-else src="@/assets/noImage.jpg" style="width: 100%;height: 100%; margin: 5%">
                </el-card>
                <el-card class="card">
                    <template #header>
                        <div class="header">
                            <span>车辆损坏情况</span>
                        </div>
                    </template>
                    <img v-if="faultModel.damage_image" :src="faultModel.damage_image"
                        style="width: 100%;height: 100%; margin: 5%" />
                    <img v-else src="@/assets/noImage.jpg" style="width: 100%;height: 100%; margin: 5%">
                </el-card>
            </div>
            <el-card style="margin-right: 20px;margin-top: 20px;margin-bottom: 20px;">
                <template #header>
                    <div class="header">
                        <span>进度情况</span>
                    </div>
                </template>
                <div class="card-container">
                    <div class="card" style="margin-left: 150px;">
                        <el-progress type="dashboard" :percentage="percentage" :color="colors" />
                    </div>
                    <div class="card">
                        <ul class="no-bullet">
                            <li v-for="item in specific">
                                <el-icon v-if="item.states === 'Done'">
                                    <SuccessFilled />
                                </el-icon>
                                <el-icon v-if="item.states === 'Waiting'">
                                    <CircleCloseFilled />
                                </el-icon>
                                <span>{{ item.name }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-card>
            <el-card style="margin-right: 20px;margin-top: 20px;margin-bottom: 20px;">
                <div class="card-container">
                    <div class="card" style="margin-left: 150px;">
                        <span>
                            {{ new Date(faultModel.date).toLocaleDateString()}}
                        </span>
                    </div>
                    <div class="card">
                        <span>
                            <span v-if="faultModel.money">
                                金额：{{ faultModel.money }}
                            </span>
                            <span v-else>
                                金额：未填写
                            </span>
                        </span>
                    </div>
                </div>
            </el-card>
        </el-drawer>


        <el-form inline>
            <!-- 自动补全输入框 -->
            <el-form-item label="客户名：">
                <el-input name="name" placeholder="请输入客户姓名" v-model.trim="faultFormModel.client_name"></el-input>
            </el-form-item>
            <el-form-item label="车架号：">
                <el-input name="property" placeholder="请输入性质"
                    v-model.trim="faultFormModel.identification_number"></el-input>
            </el-form-item>
            <el-button :icon="Search" circle @click="faultSearch" />
            <el-button type="info" :icon="Close" circle
                @click="faultFormModel.client_name = ''; faultFormModel.identification_number = ''; faultSearch()" />
        </el-form>

        <el-table v-loading="faultLoading" :data="faultList" style="width: 100%" :row-key="row => row.num">
            <el-table-column label="序号" type="index" width="80"></el-table-column>
            <el-table-column label="车架号" prop="identification_number"></el-table-column>
            <el-table-column label="保养类型" prop="maintenance_type"></el-table-column>
            <el-table-column label="工作方式" prop="work_type"></el-table-column>
            <el-table-column label="操作" width="80" header-align="center">
                <template #default="{ row }">
                    <el-button type="info" circle :icon="InfoFilled" size="mini"
                        @click="faultModel = row; showInfo()" />
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="faultCurrentPage" v-model:page-size="faultPageSize"
            :page-sizes="[3, 5, 10, 15]" layout="jumper, total, sizes, prev, pager, next" background :total="faultTotal"
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

.no-bullet {
    list-style-type: none;
    /* 不显示标号 */
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

.card-container {
    display: flex;
}

.card {
    flex: 1;
    margin-right: 20px;
}

.center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh;
}
</style>