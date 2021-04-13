import React, { useState, useEffect, useContext } from 'react';
import { Table, Modal, ModalHeader, ModalBody, Form, Button, Input } from 'reactstrap';

import api from '../../services/api';
import { Context } from '../../contexts/AuthContext';

const Liberar = (props) => {
    const { userId } = useContext(Context);
    const [notas, setNotas] = useState([]);
    const [filteredNotas, setFilteredNotas] = useState([]);
    const [modal, setModal] = useState(false);
    const [modalChegada, setModalChegada] = useState(false);
    const [notaId, setNotaId] = useState(0);
    const [agendamentoId, setAgendamentoId] = useState(0);
    const [btnDisabledLibChegada, setBtnDisabledLibChegada] = useState(false);
    const [btnDisabledLibEntrada, setBtnDisabledLibEntrada] = useState(true);
    const [btnDisabledLibSaida, setBtnDisabledLibSaida] = useState(true);
    const [data, setData] = useState({
        dataliberacaochegada: ""
    });

    let { search } = props;

    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    useEffect(() => {
        (async () => {
            const response = await api.get("/notafiscal/liberar", {
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

    const toggleModal = (id, agendamentoid) => {
        setModal(!modal);
        if (modal === false) {
            setNotaId(id);
            setAgendamentoId(agendamentoid);
            handleBtnLiberacao(agendamentoid);
        } else {
            setNotaId(0);
        }
    }

    const toggleModalChegada = (agendamentoid) => {
        setModalChegada(!modalChegada);
        if (modalChegada === false) {
            setAgendamentoId(agendamentoid);
        }
    }

    const handleBtnLiberacao = async (id) => {
        const response = await api.get(`/agendamento/${id}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });
        const { dataLiberacaoChegada, dataLiberacaoEntrada } = response.data;
        
        if (dataLiberacaoChegada && !dataLiberacaoEntrada) {
            setBtnDisabledLibChegada(true);
            setBtnDisabledLibEntrada(false);
            setBtnDisabledLibSaida(true);
        } else if (dataLiberacaoChegada && dataLiberacaoEntrada) {
            setBtnDisabledLibChegada(true);
            setBtnDisabledLibEntrada(true);
            setBtnDisabledLibSaida(false);
        } else {
            setBtnDisabledLibChegada(false);
            setBtnDisabledLibEntrada(true);
            setBtnDisabledLibSaida(true);
        }
    }

    const handleLiberacaoChegada = async (id) => {
        const response = await api.get(`/agendamento/${id}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });
        const { motorista, documento, placa, dataEntrada, dataSaida, aprovadorId, dataAprovacao, usuarioId, notaFiscalId, dataCadastro} = response.data;

        if (response) {
            await api.put(`/agendamento/${id}`, {
                id,
                motorista,
                documento,
                placa,
                dataEntrada,
                dataSaida,
                aprovadorId,
                dataAprovacao,
                usuarioId,
                notaFiscalId,
                liberadorId: userId,
                dataLiberacaoChegada: data.dataliberacaochegada,
                dataCadastro
            }, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            }).then(res => {
                setData({
                    dataliberacaochegada: ""
                })
                setAgendamentoId(0);
                setModal(false);
            })
        }
    }

    const handleLiberacaoEntrada = async (id) => {
        const response = await api.get(`/agendamento/${id}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });
        const { motorista, documento, placa, dataEntrada, dataSaida, aprovadorId, dataAprovacao, usuarioId, notaFiscalId, dataCadastro, dataLiberacaoChegada} = response.data;
        const dataLibEntrada = new Date();

        if (response) {
            await api.put(`/agendamento/${id}`, {
                id,
                motorista,
                documento,
                placa,
                dataEntrada,
                dataSaida,
                aprovadorId,
                dataAprovacao,
                usuarioId,
                notaFiscalId,
                liberadorId: userId,
                dataLiberacaoEntrada: dataLibEntrada,
                dataCadastro,
                dataLiberacaoChegada
            }, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            }).then(res => {
                setAgendamentoId(0);
                setModal(false);
            })
        }
    }

    const handleLiberacaoSaida = async (id) => {
        const response = await api.get(`/agendamento/${id}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });
        const { motorista, documento, placa, dataEntrada, dataSaida, aprovadorId, dataAprovacao, usuarioId, dataLiberacaoEntrada, notaFiscalId, dataCadastro, dataLiberacaoChegada} = response.data;
        const dataLibSaida = new Date();

        if (response) {
            await api.put(`/agendamento/${id}`, {
                id,
                motorista,
                documento,
                placa,
                dataEntrada,
                dataSaida,
                aprovadorId,
                dataAprovacao,
                usuarioId,
                notaFiscalId,
                liberadorId: userId,
                dataLiberacaoChegada,
                dataLiberacaoEntrada,
                dataLiberacaoSaida: dataLibSaida,
                dataCadastro
            }, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            }).then(res => {
                
                const agendamentos = notas.filter(nota => nota.id !== notaId);
                setNotas(agendamentos);

                setAgendamentoId(0);
                setModal(false);
            })

            handleStatusNotaFiscal(notaId);
        }
    }

    const handleStatusNotaFiscal = async (id) => {
        const response = await api.get(`/notafiscal/${id}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });
        const { nf, fornecedor, cidade, uf, transportadora, valor, material, frete, volumes, peso, dataCadastro, pedido, km, tipoVolume, usuarioId } = response.data;
        if (response) {
            await api.put(`/notafiscal/${id}`,{
                id,
                nf,
                fornecedor,
                cidade,
                uf,
                transportadora,
                valor,
                material,
                frete,
                volumes,
                peso,
                pedido,
                km,
                tipoVolume,
                usuarioId,
                status: 3,
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

    const handleChange = (e) => {
        const value = e.target.value;

        setData({
            ...data,
            [e.target.name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (btnDisabledLibEntrada === false) {
            handleLiberacaoEntrada(agendamentoId);
        } else {
            handleLiberacaoSaida(agendamentoId);
        }
    }

    const handleSubmitCadastrarChegada = (e) => {
        e.preventDefault();

        if (btnDisabledLibChegada === false) {
            handleLiberacaoChegada(agendamentoId);
            setModalChegada(false);
        }
    }

    const renderHeader = () => {
        let headerElement = ['Transportadora', 'Nota Fiscal', 'Fornecedor', 'Motorista', 'Documento', 'Placa', 'Entrada', 'Saída', ''];

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
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].motorista}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].documento}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].placa}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataEntrada}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataSaida}</td>
                        <td>
                            <svg onClick={() => toggleModal(nota.id, nota.agendamentos[0].id)} width="1.2em" height="1.2em" viewBox="0 0 16 16" className="bi bi-box-arrow-in-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            </svg>
                        </td>
                    </tr>
                )                     
            })        
        }
        
        if (filteredNotas) {
            return filteredNotas.map(nota => {
                return (
                    <tr key={nota.id}>
                        <td>{nota.transportadora}</td>
                        <td>{nota.nf}</td>
                        <td>{nota.fornecedor}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].motorista}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].documento}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].placa}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataEntrada}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataSaida}</td>
                        <td>
                            <svg onClick={() => toggleModal(nota.id, nota.agendamentos[0].id)} width="1.2em" height="1.2em" viewBox="0 0 16 16" className="bi bi-box-arrow-in-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
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
                    <tr>
                        {renderHeader()}
                    </tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </Table>

            <div className="modal-liberar">
            <Modal
                isOpen={modal}
                toggle={toggleModal}
                size="sm"
                centered
                backdrop="static"
                keyboard={false}
            >
            <ModalHeader toggle={toggleModal}>Liberar</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <Button 
                        color="info" 
                        outline
                        block
                        style={{marginTop: 15}}
                        disabled={btnDisabledLibChegada}
                        onClick={() => toggleModalChegada(agendamentoId)}
                    >
                        Chegada
                    </Button>
                    <Button 
                        color="success" 
                        outline
                        block
                        style={{marginTop: 15}}
                        disabled={btnDisabledLibEntrada}
                    >
                        Entrada
                    </Button>
                    <Button 
                        color="warning" 
                        outline 
                        block
                        style={{marginTop: 15}}
                        disabled={btnDisabledLibSaida}
                   >
                       Saída
                    </Button>
                </Form>
            </ModalBody>
            </Modal>
            <Modal
                isOpen={modalChegada}
                toggle={toggleModalChegada}
                size="sm"
                centered
                backdrop="static"
                keyboard={false}
            >
            <ModalHeader toggle={toggleModalChegada}>Chegada</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmitCadastrarChegada}>
                    <Input 
                        type="datetime-local" 
                        name="dataliberacaochegada" 
                        id="chegada"
                        placeholder="chegada" 
                        required
                        onChange={handleChange}
                        value={data.dataliberacaochegada}
                    />
                    <Button 
                        color="secondary" 
                        outline
                        block
                        style={{marginTop: 15}}
                    >
                        Salvar
                    </Button>
                </Form>
            </ModalBody>
            </Modal>
        </div>
    </>
    )
}

export default Liberar;