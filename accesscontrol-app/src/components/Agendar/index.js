import React, { useState, useEffect, useContext } from 'react';
import { Form, Label, Input, Table, Modal, ModalHeader, ModalBody, Row, Col, FormGroup, Button } from 'reactstrap';

import api from '../../services/api';
import { Context } from '../../contexts/AuthContext';

const Agendar = (props) => {
    const { userId } = useContext(Context);
    const [notas, setNotas] = useState([]);
    const [filteredNotas, setFilteredNotas] = useState([]);
    const [modal, setModal] = useState(false);
    const [notaId, setNotaId] = useState(0);
    const [data, setData] = useState({
        id: 0,
        notafiscalid: 0,
        motorista: "",
        documento: "",
        placa:"",
        dataentrada: "",
        datasaida: "",
        usuarioid: 0,
        dataCadastro: ""
    });
    const { className, search } = props;
    
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    
    useEffect(() => {
        (async () => {
            const response = await api.get("/notafiscal/agendar", {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });

            setNotas(response.data);
        })();
    }, [userToken]);

    useEffect(() => {
        const filterNotas = notas.filter((nota) => {
            return nota.nf.toString() === search;
        })

        setFilteredNotas(filterNotas);
        
        // eslint-disable-next-line
    }, [search]);

    const showAgendamento = async (id) => {
        const response = await api.get(`/notafiscal/${id}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });
        
        if (response.data.agendamentos[0]) {
            setData({
                id: response.data.agendamentos[0].id,
                motorista: response.data.agendamentos[0].motorista,
                documento: response.data.agendamentos[0].documento,
                placa: response.data.agendamentos[0].placa,
                dataentrada: "",
                datasaida: ""
            });
        }
    }

    const toggleModal = (id) => {
        setModal(!modal);
        if (modal === false) {
            setNotaId(id);
            showAgendamento(id);
        } else {
            setNotaId(0);
            setData({
                id: 0,
                notafiscalid: 0,
                motorista: "",
                documento: "",
                placa:"",
                dataentrada: "",
                datasaida: "",
                usuarioid: 0,
                dataCadastro: ""
            });
        }
    }

    const handleStatusNotaFiscal = async (notaId) => {
        if (notaId) {
            const response = await api.get(`/notafiscal/${notaId}`, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });
            const { nf, fornecedor, uf, cidade, transportadora, valor, frete, material, volumes, peso, dataCadastro, pedido, km, tipoVolume, usuarioId } = response.data;

            if (response) {
                await api.put(`/notafiscal/${notaId}`, {
                    id: notaId,
                    nf,
                    fornecedor,
                    uf,
                    cidade,
                    transportadora,
                    valor,
                    frete,
                    material,
                    volumes,
                    peso,
                    pedido,
                    km,
                    tipoVolume,
                    status: 1,
                    usuarioId,
                    dataCadastro
                }, {
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                }).then(res => {
                    setNotaId(0);
                })
            }
        }

        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataCad = new Date();
        
        if (data.id > 0) {
            const agendamentoId = data.id;

            await api.put(`/agendamento/${agendamentoId}`, {
                ...data,
                id: agendamentoId,
                notafiscalid: notaId,
                dataCadastro: dataCad,
                usuarioid: userId}, {
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                }).then(res => {
                    
                    handleStatusNotaFiscal(notaId);
                    
                    setModal(false);
                    setData({
                        id: 0,
                        notafiscalid: 0,
                        motorista: "",
                        documento: "",
                        placa:"",
                        dataentrada: "",
                        datasaida: "",
                        usuarioid: 0,
                        dataCadastro: ""
                    });
                });
                
                return;
        }

        await api.post("/agendamento", {
            ...data, 
            notafiscalid: notaId, 
            dataCadastro: dataCad,
            usuarioid: userId}, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            }).then(res => {
                
                handleStatusNotaFiscal(notaId);

                setModal(false);
                setData({
                    id: 0,
                    notafiscalid: 0,
                    motorista: "",
                    documento: "",
                    placa:"",
                    dataentrada: "",
                    datasaida: "",
                    usuarioid: 0,
                    dataCadastro: ""
                });
            });
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    }

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta nota fiscal?")) {
            await api.delete(`/notafiscal/${id}`, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            }).then(res => {
                const del = notas.filter(nota => nota.id !== id);
                setNotas(del);
            })
        }
     }

    const renderHeader = () => {
        let headerElement = ['Transportadora', 'Nota Fiscal', 'Fornecedor', 'Pedido', 'Cidade', 'UF', '', ''];

        return headerElement.map((key, index) => {
            return <th key={index}>{key}</th>
        })
    }

    const renderBody = () => {
        if (search === "") {
            return notas && notas.map(nota => {
                return (
                    <tr key={nota.id}>
                        <td>{nota.transportadora}</td>
                        <td>{nota.nf}</td>
                        <td>{nota.fornecedor}</td>
                        <td>{nota.pedido}</td>
                        <td>{nota.cidade}</td>
                        <td>{nota.uf}</td>
                        <td>
                            <svg onClick={() => toggleModal(nota.id)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-calendar" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                        </td>
                        <td>
                            <svg onClick={() => handleDelete(nota.id)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </td>
                    </tr>
                )                     
            })
        } else {
            return filteredNotas.map(nota => {
                return (
                    <tr key={nota.id}>
                        <td>{nota.transportadora}</td>
                        <td>{nota.nf}</td>
                        <td>{nota.fornecedor}</td>
                        <td>{nota.cidade}</td>
                        <td>{nota.uf}</td>
                        <td>
                            <svg onClick={() => toggleModal(nota.id)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-calendar" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                        </td>
                        <td>
                            <svg onClick={() => handleDelete(nota.id)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </td>
                    </tr>
                )
            })            
        }
    }

    return (
        <>
        <Table borderless responsive hover>
            <thead>
                <tr>{renderHeader()}</tr>
            </thead>
            <tbody>
                {renderBody()}
            </tbody>
        </Table>
        <div className="modal-agendar">
            <Modal 
                isOpen={modal} 
                toggle={toggleModal} 
                className={className}
                size="md"
                centered
                backdrop="static"
                keyboard={false}
                >
                <ModalHeader style={{ backgroundColor: '#f58426'}} toggle={toggleModal}>Agendar</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="motorista">Motorista</Label>
                                    <Input 
                                        type="text" 
                                        name="motorista"
                                        id="motorista"
                                        placeholder="motorista" 
                                        value={data.motorista}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="documento">Documento</Label>
                                    <Input 
                                        type="text" 
                                        name="documento"
                                        id="documento"
                                        placeholder="documento" 
                                        value={data.documento}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="placa">Placa</Label>
                                    <Input 
                                        type="text" 
                                        name="placa"
                                        id="placa"
                                        placeholder="placa" 
                                        value={data.placa}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="entrada">Entrada</Label>
                                    <Input 
                                        type="datetime-local" 
                                        name="dataentrada" 
                                        id="entrada"
                                        placeholder="entrada" 
                                        value={data.dataentrada}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="saida">Saida</Label>
                                    <Input 
                                        type="datetime-local" 
                                        name="datasaida" 
                                        id="saida"
                                        placeholder="saida" 
                                        value={data.datasaida}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Button 
                            outline 
                            color="secondary" 
                            block>
                                Cadastrar
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
        </>
    )
}

export default Agendar;