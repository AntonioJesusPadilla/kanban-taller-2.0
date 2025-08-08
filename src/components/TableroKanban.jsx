import { Link, useLocation } from 'react-router-dom'
import { ESTADOS } from '../constants/estados'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export default function TableroKanban({ vehiculos, estados, onMover, onEliminar }) {
  const location = useLocation()
  // Función que maneja el evento de finalizar el drag
  const onDragEnd = (result) => {
  const { source, destination, draggableId } = result

  // Si no soltó en una zona válida, salir
  if (!destination) return

  // Si no se movió a otra columna, salir
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) return

  // Aquí se actualiza el estado en Firestore, moviendo el vehículo
  onMover(draggableId, destination.droppableId)
  }

    console.log("📋 Vehículos recibidos por TableroKanban:", vehiculos)
    // 🖼️ Render
    return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">📋 Tablero de Reparaciones</h1>
        {location.pathname === '/EntregadosHoy' && (
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            ← Volver al tablero
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {estados.map(estado => {
              const bgPorEstado = {
                [ESTADOS.ENTRADA]: 'bg-blue-50',
                [ESTADOS.DIAGNÓSTICO]: 'bg-yellow-50',
                [ESTADOS.REPARACIÓN]: 'bg-orange-50',
                [ESTADOS.ENTREGA]: 'bg-green-50'
              }
              const borderPorEstado = {
                [ESTADOS.ENTRADA]: 'border-blue-400',
                [ESTADOS.DIAGNÓSTICO]: 'border-yellow-400',
                [ESTADOS.REPARACIÓN]: 'border-orange-400',
                [ESTADOS.ENTREGA]: 'border-green-400',
              }
              const iconosPorEstado = {
                [ESTADOS.ENTRADA]: '🚗',
                [ESTADOS.DIAGNÓSTICO]: '🔍',
                [ESTADOS.REPARACIÓN]: '🛠️',
                [ESTADOS.ENTREGA]: '✅'
              }
             
            return (
              <Droppable key={estado} droppableId={estado}>
                {(provided, snapshot) =>(
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-xl shadow-inner p-4 min-h-[300px] transition-all 
                        ${bgPorEstado[estado] || 'bg-white'} 
                        ${snapshot.isDraggingOver ? 'bg-blue-100' : ''}`}
                  >
                  
                  <h2 className="flex items-center justify-center gap-2 font-semibold text-xl capitalize mb-4 text-center text-blue-800 gap-2">
                    <span>{iconosPorEstado[estado]}</span> {estado}
                  </h2>

                  {vehiculos
                    .filter(v => v.estado === estado)
                    .map((vehiculo, index) => (
                      <Draggable key={vehiculo.id} draggableId={vehiculo.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                           className={`bg-white rounded-2xl shadow-md border-2 p-4 mb-4 transition-colors duration-200 
                              ${borderPorEstado[estado] || 'border-gray-300'} 
                              ${snapshot.isDragging ? 'bg-blue-100' : 'hover:shadow-lg'}`}
                          >
                            
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-semibold text-blue-700 text-sm uppercase tracking-wide">
                                {vehiculo.matricula}
                              </div>
                              <button
                                onClick={() => onEliminar(vehiculo.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                                title="Eliminar vehículo"
                              >
                                🗑
                              </button>
                            </div>

                          <div className="text-lg font-bold text-gray-800 mb-1">
                            {vehiculo.vehiculo}
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            {vehiculo.descripcion}
                          </div>

                          <div className="text-xs text-gray-500">
                            <p><span className="font-semibold">Cliente:</span> {vehiculo.cliente}</p>
                            <p><span className="font-semibold">Técnico:</span> {vehiculo.tecnico}</p>
                            <p><span className="font-semibold">Estado:</span> {vehiculo.estado.toUpperCase()}</p>
                          </div>
                        </div>
                        )}
                    </Draggable>
                  ))}

                {provided.placeholder}

                {vehiculos.filter(v => v.estado === estado).length === 0 && (
                  <p className="text-gray-400 text-sm text-center">Sin vehículos</p>
                )}
              </div>
            )}
          </Droppable>
          )
        })}
      </div>
    </DragDropContext>
  )
}