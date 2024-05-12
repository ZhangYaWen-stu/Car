<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    MessageBox,
    Service,
    Upload,
    Download,
    Checked
} from '@element-plus/icons-vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const activeIndex = ref('/CustomerInfo');
const handleMenuFocus = index => {
    activeIndex.value = index;
}
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu :default-active="activeIndex" @select="handleMenuFocus" active-text-color="#ffd04b" background-color="#041c32" active-background-color="#f5f7fa" text-color="#fff" unique-opened="false" router>
                <el-menu-item index="/CustomerInfo">
                    <el-icon>
                        <UserFilled />
                    </el-icon>
                    <span>客户管理</span>
                </el-menu-item>
                <el-menu-item index="/CarInfo">
                    <el-icon>
                        <UserFilled />
                    </el-icon>
                    <span>车辆管理</span>
                </el-menu-item>
                <el-menu-item index="/RepairInfo">
                    <el-icon>
                        <Checked />
                    </el-icon>
                    <span>维修管理</span>
                </el-menu-item>
                <el-menu-item index="/Repairman">
                    <el-icon>
                        <Checked />
                    </el-icon>
                    <span>员工管理</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>图书管理系统 ©2023 Created by chennann</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #041c32;

        &__logo {
            height: 120px;
            background: url('@/assets/car_ico.png') no-repeat center / 60px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>