import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';

import api from '../../services/api';
import axios from 'axios';

import { Context } from '../../contexts/AuthContext';

const Cadastrar = (props) => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    
    const { userId } = useContext(Context);

    const [data, setData] = useState({
        nf: "",
        fornecedor: "",
        cidade: "",
        uf: "",
        transportadora: "",
        valor: "",
        material: "",
        frete: "",
        volumes: "",
        peso: "",
        pedido: "",
        tipovolume: "",
        km: "",
        usuarioid: 0,
        dataCadastro: ""
    });
    const [ufs, setUfs] = useState([]);
    const [cidades, setCidades] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
            if (response) {
                const orderedUfs = response.data.sort((a, b) => {
                    let x = a.sigla.toUpperCase(),
                        y = b.sigla.toUpperCase();
                    
                        return x === y ? 0 : x > y ? 1 : -1;
                });

                setUfs(orderedUfs);
            }
        })();
    }, []);

    const handleChangeCidade = async (e) => {
        const value = e.target.value;
        const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`);

        if (response) {
            const orderedCidades = response.data.sort((a, b) => {
                let x = a.nome.toUpperCase(),
                    y = b.nome.toUpperCase();

                    return x === y ? 0 : x > y ? 1 : -1;
            });

            setCidades(orderedCidades);
            
            setData({
                ...data,
                [e.target.name]: value
            });
        }
    }

    const handleChange = (e) => {
        const value = e.target.value;

        setData({
            ...data,
            [e.target.name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataCad = new Date();

            await api.post("/notafiscal", {
                ...data,
                nf: parseInt(data.nf),
                valor: parseFloat(data.valor),
                frete: parseInt(data.frete),
                volumes: parseInt(data.volumes),
                peso: parseFloat(data.peso),
                km: data.km ? parseFloat(data.km) : 0,
                dataCadastro: dataCad,
                usuarioid: userId}, {
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                }).then(res => {
                    setData({
                        nf: "",
                        fornecedor: "",
                        cidade: "",
                        uf: "",
                        transportadora: "",
                        valor: "",
                        material: "",
                        frete: "",
                        volumes: "",
                        peso: "",
                        pedido: "",
                        tipovolume: "",
                        km: "",
                        usuarioid: 0,
                        dataCadastro: ""
                    });
                    setCidades([]);
                });

        } catch {
            alert("Erro ao tentar cadastrar a nota fiscal!\nVerifique se todos os campos estão preenchidos corretamente.");
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="notafiscal">Nota Fiscal</Label>
                            <Input
                                type="text" 
                                name="nf"
                                id="notafiscal"
                                placeholder="nota fiscal" 
                                onChange={handleChange}
                                value={data.nf}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col md={8}>
                        <FormGroup>
                            <Label for="fornecedor">Fornecedor</Label>
                            <Input 
                                type="text" 
                                name="fornecedor" 
                                id="fornecedor"
                                placeholder="fornecedor"
                                onChange={handleChange}
                                value={data.fornecedor}
                                required
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="uf">UF</Label>
                            <Input
                                type="select" 
                                name="uf" 
                                id="uf"
                                placeholder="UF"
                                onChange={handleChangeCidade}
                                value={data.uf}
                                required
                            >
                                <option value=""></option>
                                {ufs.map(uf => {
                                    return (
                                        <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                                    )
                                })}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={8}>
                        <FormGroup>
                            <Label for="cidade">Cidade</Label>
                            <Input
                                type="select" 
                                name="cidade" 
                                id="cidade"
                                placeholder="cidade"
                                onChange={handleChange}
                                value={data.cidade}
                                required
                            >
                                <option value=""></option>
                                {cidades.map(cidade => {
                                    return (
                                        <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                                    )
                                })}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="pedido">Pedido</Label>
                            <Input
                                type="text" 
                                name="pedido" 
                                id="pedido"
                                placeholder="pedido"
                                onChange={handleChange}
                                value={data.pedido}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col md={8}>
                        <FormGroup>
                            <Label for="transportadora">Transportadora</Label>
                            <Input
                                type="text" 
                                name="transportadora" 
                                id="transportadora"
                                placeholder="transportadora"
                                onChange={handleChange}
                                value={data.transportadora}
                                required
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="valor">Valor</Label>
                            <Input
                                type="number" 
                                min={1}
                                step=".01"
                                name="valor" 
                                id="valor"
                                placeholder="valor"
                                onChange={handleChange}
                                value={data.valor}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="frete">Frete</Label>
                            <Input
                                type="select" 
                                name="frete" 
                                id="frete"
                                placeholder="CIF/ FOB"
                                onChange={handleChange}
                                value={data.frete}
                                required
                            >
                                <option></option>
                                <option value={0}>CIF</option>
                                <option value={1}>FOB</option>
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="material">Material</Label>
                            <Input
                                type="text" 
                                name="material" 
                                id="material"
                                placeholder="material"
                                onChange={handleChange}
                                value={data.material}
                                required
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="volumes">Volumes</Label>
                            <Input
                                type="number" 
                                min={1}
                                step=".01"
                                name="volumes" 
                                id="volumes"
                                placeholder="volumes"
                                onChange={handleChange}
                                value={data.volumes}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="tipovolume">Tipo</Label>
                            <Input
                                type="text" 
                                name="tipovolume" 
                                id="tipovolume"
                                placeholder="ex.: palete, bobina"
                                onChange={handleChange}
                                value={data.tipovolume}
                                required
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="peso">Peso</Label>
                            <Input
                                type="number" 
                                min={1}
                                step=".01"
                                name="peso" 
                                id="peso"
                                placeholder="peso"
                                onChange={handleChange}
                                value={data.peso}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="km">KM</Label>
                            <Input
                                type="number" 
                                name="km" 
                                id="km"
                                placeholder="km"
                                onChange={handleChange}
                                value={data.km}
                            />
                        </FormGroup>
                    </Col>

                </Row>
                <Button 
                    outline 
                    color="secondary"
                    block
                >
                    Cadastrar
                </Button>
            </Form>
        </>
    )
}

export default Cadastrar;