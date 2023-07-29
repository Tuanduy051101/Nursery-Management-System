<template>
    <Form>
        
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Select from "../components/forms/Select.vue";
import BAdd from "../components/buttons/Add.vue";
import BCancel from "../components/buttons/Cancel.vue";
import Children from "../services/children.service";

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
        children: {
            type: Object,
            default: {},
        },
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
            name_c: yup.string().required("Name must have a valid!"),
            dateOfBirth: yup
                .date()
                .min("2001-11-05", "Date must start from 2001-11-05 !"),
            address_c: yup.string().required("Address must have a valid!"),
        });
        return {
            formSchema,
            relationshipList: [
                {
                    _id: 'Father',
                    name: 'Father',
                },
                {
                    _id: 'Mother',
                    name: 'Mother',
                },
                {
                    _id: 'Brother',
                    name: 'Brother',
                },
                {
                    _id: 'Sister',
                    name: 'Sister',
                },
                {
                    _id: 'Guardian',
                    name: 'Guardian',
                }
            ],
            children: [],
        };
    },
    methods: {
        submitData() {
            this.$emit('submit:form');
        },
        async getAllChildren() {
            try {
                this.children = await Children.getAll();
            }catch(err) {
                console.log(err);
            }
        }
    },
    created() {
        this.getAllChildren();
    }
};
</script>
