<template>
    <Form @submit="sub">

    </Form>
</template>

<script>
import * as yup from 'yup';
import {Form, Field, ErrorMessage} from 'vee-validate';
export default {
    components: {
        Form,
        Field,
        ErrorMessage
    },
    emits: ['submit:input'],
    data() {
        const formSchema = yup.object().shape({
            name: yup
                .string()
                .required("Name must have a valid.")
                .min(2, "Name must be at least 2 characters.")
        });
        return {
            formSchema,
            inputValue: "",
        }
    },
    methods: {
        submitData() {
            this.$emit('submit:input', this.inputValue);
        }
    }
}
</script>