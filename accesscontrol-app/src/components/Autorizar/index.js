import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';

import api from '../../services/api';
import { Context } from '../../contexts/AuthContext';

const Autorizar = (props) => {
    const { userId } = useContext(Context);
    const [notas, setNotas] = useState([]);
    const [filteredNotas, setFilteredNotas] = useState([]);
    const [modal, setModal] = useState(false);
    const [notaId, setNotaId] = useState(0);
    const [data, setData] = useState({
        id: 0,
        notaFiscalId: 0,
        motorista: "",
        documento: "",
        placa: "",
        dataentrada: "",
        datasaida: "",
        dataaprovacao: "",
        usuarioId: 0,
        aprovadorId: 0,
        dataCadastro: ""
    });

    const { search } = props;

    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    useEffect(() => {
        (async () => {
            const response = await api.get("/notafiscal/autorizar", {
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

    const toggleModal = (id) => {
        setModal(!modal);
        if (modal === false) {
            setNotaId(id);
            showAgendamento(id);
        } else {
            setNotaId(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    status: 2,
                    usuarioId,
                    dataCadastro
                }, {
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                }).then(res => {
                    
                    handleStatusAgendamento(data.id)

                    const agendamentos = notas.filter(nota => nota.id !== notaId);
                    setNotas(agendamentos);
                    setNotaId(0);
                    setModal(false);
                })
            }
        }

        return;
    }

    const showAgendamento = async (id) => {
        const response = await api.get(`/notafiscal/${id}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });
        
        if (response.data.agendamentos[0]) {
            setData({ id: response.data.agendamentos[0].id });
        }
    }
    
    const handleStatusAgendamento = async (agendamentoId) => {
        if (agendamentoId) {
            const response = await api.get(`/agendamento/${agendamentoId}`, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });
            const {notaFiscalId, motorista, documento, placa, dataEntrada, dataSaida, dataCadastro, usuarioId} = response.data;
            let dataAprovacao = new Date();

            if (response) {
                await api.put(`/agendamento/${agendamentoId}`, {
                    id: agendamentoId,
                    notaFiscalId,
                    motorista,
                    documento,
                    placa,
                    dataEntrada,
                    dataSaida,
                    dataaprovacao: dataAprovacao,
                    aprovadorId: userId,
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
        let headerElement = ['Transportadora', 'Nota Fiscal', 'Fornecedor', 'Pedido', 'Cidade', 'UF', 'Entrada', 'Saída', '', ''];

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
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataEntrada}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataSaida}</td>
                        <td>
                            <svg onClick={() => toggleModal(nota.id)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
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

        if (filteredNotas) {
            return filteredNotas.map(nota => {
                return (
                    <tr key={nota.id}>
                        <td>{nota.transportadora}</td>
                        <td>{nota.nf}</td>
                        <td>{nota.fornecedor}</td>
                        <td>{nota.cidade}</td>
                        <td>{nota.uf}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataEntrada}</td>
                        <td>{nota.agendamentos[0] && nota.agendamentos[0].dataSaida}</td>
                        <td>
                            <svg onClick={() => toggleModal(nota.id)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
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
                    <tr>
                        {renderHeader()}
                    </tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </Table>
            <div className="modal-autorizar">
                <Modal
                    isOpen={modal}
                    toggle={toggleModal}
                    size="sm"
                    centered
                    backdrop="static"
                    keyboard={false}
                >
                <ModalHeader toggle={toggleModal}>Autorizar</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        Tem certeza que deseja autorizar este agendamento?
                        <Button 
                            color="success" 
                            outline 
                            block 
                            type="submit"
                            style={{marginTop: 15}}
                        >Sim</Button>
                    </Form>
                </ModalBody>
                </Modal>
            </div>
        </>
    )   
}

export default Autorizar;