<template>
    <Form @submit="submitData" :validation-schema="formSchema" v-slot="{ errors }">
        <div class="flex flex-row mt-5">
            <div class="w-2/12 mr-4 flex h-full flex-col items-start justify-center">
                <div v-for="(step, index) in stepList" :key="step.id" class="flex flex-row items-center mb-8">
                    <span class="h-10 w-10 text-white mr-3 rounded-md flex items-center justify-center" :class="[
                        step.id == activeStep
                            ? 'border border-solid border-violet-500'
                            : 'border border-solid border-white',
                    ]">{{ step.id }}</span>
                    <span class="" :class="[step.id == activeStep ? 'text-violet-400' : 'text-white']">{{ step.name
                    }}</span>
                </div>
            </div>
            <div class="border border-solid border-t-0 border-l-0 border-b-0 border-violet-500 mx-4"></div>
            <!-- parents detail -->
            <div class="w-10/12">
                <!-- name -->
                <div class="mb-6">
                    <label for="name_p" class="text-white ml-1">Name</label>
                    <Field name="name_p" id="name_p" type="text" placeholder="Enter parent's name"
                        v-model="parentsDetail.name"
                        class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
                        :class="[errors.name_p ? 'border border-solid border-red-500' : 'border-violet-500']" />
                    <ErrorMessage name="name_p" class="text-red-500 ml-1 mt-1 text-sm" />
                </div>
                <!-- gender -->
                <div class="mb-6">
                    <label for="gender" class="text-white ml-1">Gender</label>
                    <div class="flex items-center">
                        <input checked type="radio" name="gender" id="gender" value="true"
                            v-model="parentsDetail.gender" class="border border-solid border-violet-500 outline-none" />
                        <span class="ml-2 mr-10 text-white">male</span>
                        <input type="radio" name="gender" id="gender" value="false" v-model="parentsDetail.gender"
                            class="border border-solid border-violet-500 outline-none" />
                        <span class="ml-2 mr-10 text-white">female</span>
                    </div>
                </div>
                <!-- phone -->
                <div class="mb-6 flex flex-col">
                    <label for="phone" class="text-white ml-1">Phone Number</label>
                    <Field name="phone" type="text" placeholder="Enter phone number" v-model="parentsDetail.phone"
                        class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
                        :class="[errors.phone ? 'border border-solid border-red-500' : 'border-violet-500']" />
                    <!-- <p v-if="checkCreate(teacher.phone)" class="text-red-500 ml-1 mt-1 text-sm"> Phone already exists !
                    </p> -->
                    <ErrorMessage name="phone" class="text-red-500 ml-1 mt-1 text-sm" />
                </div>
                <!-- mail -->
                <div class="mb-6 flex flex-col">
                    <label for="mail" class="text-white ml-1">Mail</label>
                    <Field name="mail" type="email" placeholder="Enter e-mail address" v-model="parentsDetail.mail"
                        class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
                        :class="[errors.mail ? 'border border-solid border-red-500' : 'border-violet-500']" />
                    <!-- <p v-if="checkCreate(teacher.mail)" class="text-red-500 ml-1 mt-1 text-sm">
                        Email already exists !
                    </p> -->
                    <ErrorMessage name="mail" class="text-red-500 ml-1 mt-1 text-sm" />
                </div>
                <!-- relationship -->
                <div class="mb-6 flex flex-col">
                    <label for="" class="text-white ml-1">Relationship</label>
                    <Select :options="relationshipList" class="h-10"
                        @update:modelValue="(value) => (parentsDetail.relationship = value)" :class="[
                            !parentsDetail.relationship ? 'border border-solid border-red-500' : '',
                        ]" />
                    <p v-if="!parentsDetail.relationship" name="" class="text-red-500 ml-1 mt-1 text-sm">
                        Relationship must have a valid !
                    </p>
                </div>
                <!-- address -->
                <div class="mb-6">
                    <label for="address_p" class="text-white ml-1">Address</label>
                    <Field name="address_p" id="address_p" type="text" placeholder="Enter parent's address"
                        v-model="parentsDetail.address"
                        class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
                        :class="[errors.address_p ? 'border border-solid border-red-500' : 'border-violet-500']" />
                    <ErrorMessage name="address_p" class="text-red-500 ml-1 mt-1 text-sm" />
                </div>
                <div class="mt-6 flex flex-row">
                    <BAdd class="mr-6"/>
                    <BCancel @click="this.$emit('cancel', false)" />
                </div>
            </div>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Select from "../components/forms/Select.vue";
import BAdd from "../components/buttons/Add.vue";
import BCancel from "../components/buttons/Cancel.vue";
import Children from "../services/children.service";
import ParentsDetail from "../services/parents-detail.service";
import Swal from "sweetalert2";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
        Select,
        BAdd,
        BCancel,
    },
    props: {
        parentsDetail: {
            type: Object,
            default: {},
        },
    },
    emits: ["submit:form"],
    data() {
        const formSchema = yup.object().shape({
            name_p: yup.string().required("Name must have a valid!"),
            phone: yup
                .string()
                .required("Phone must have a valid!")
                .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Invalid phone number!"),
            mail: yup
                .string()
                .required("Email must have a valid !")
                .email("Incorrect E-mail !"),
            address_p: yup.string().required("Address must have a valid!"),
        });
        return {
            formSchema,
            relationshipList: [
                {
                    _id: "Father",
                    name: "Father",
                },
                {
                    _id: "Mother",
                    name: "Mother",
                },
                {
                    _id: "Brother",
                    name: "Brother",
                },
                {
                    _id: "Sister",
                    name: "Sister",
                },
                {
                    _id: "Guardian",
                    name: "Guardian",
                },
            ],
            childrenList: [],
            parentsList: [],
            stepList: [
                {
                    id: 1,
                    name: "Parents",
                },
            ],
            background: "rgb(71 55 133 / var(--tw-bg-opacity))",
        };
    },
    methods: {
        async submitData() {
            // if(this.checkCreate() == true) {
            //     const check = Swal.fire({
            //         background: this.background,
            //         color: 'white',
            //         icon: 'warning',
            //         title: 'Children already exists!',
            //         text: 'Do you want to continue ?',
            //         showConfirmButton: true,
            //         showCancelButton: true,
            //         reverseButtons: true,
            //         confirmButtonText: 'Continue'
            //     });
            //     if((await check).isConfirmed) {
            //         this.$emit("submit:form");
            //     }
            // }else {
            //     this.$emit("submit:form");
            // }
            this.$emit("submit:form");
        },
        async getAllChildren() {
            try {
                this.childrenList = await Children.getAll();
            } catch (err) {
                console.log(err);
            }
        },
        async getAllParents() {
            try {
                this.parentsList = await ParentsDetail.getAll();
            }catch(err) {
                console.log(err);
            }
        },
        // checkCreate() {
        //     for (var child of this.childrenList) {
        //         for (var parent of this.parentsList) {
        //             console.log(this.children.name.toLowerCase());
        //             if(child.name == this.children.name.toLowerCase() && (parent.phone == this.parentsDetail.phone || parent.mail == this.parentsDetail.mail.toLowerCase())) {
        //                 return true;
        //             }
        //         }
        //     }
        //     return false;
        // }
    },
    created() {
        this.getAllParents();
    },
};
</script>
