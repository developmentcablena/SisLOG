import React, { useContext, useState } from 'react';
import { Form, Row, Input, Button, FormGroup, Col, Card, CardBody, CardTitle, Alert } from 'reactstrap';

import { Context } from '../../contexts/AuthContext';

import './styles.css';

function Login() {
    const { handleLogin, setError, error } = useContext(Context);

    const [data, setData] = useState({
        conta: "",
        senha: ""
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
        setError(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        handleLogin({ data });
    }

    return (
        <div className="container">
            <div className="login-page">
                <Card className="login-card">
                    <CardBody>
                        <CardTitle>
                            <strong>LOGIN</strong>
                            {error ? <Alert color="danger">usuário ou senha inválidos</Alert> : ""}
                        </CardTitle>

                        <Form onSubmit={handleSubmit}>
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="conta"
                                            value={data.usuario}
                                            onChange={handleChange}
                                            placeholder="usuário"
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Input
                                            type="password"
                                            name="senha"
                                            value={data.senha}
                                            onChange={handleChange}
                                            placeholder="senha"
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Button outline color="secondary" block>Entrar</Button>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Login;