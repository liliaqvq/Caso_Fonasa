import os
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from models import db, Paciente, Hospital, Consulta, PacienteNino, PacienteJoven, PacienteAnciano

load_dotenv()

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['ENV'] = 'development'
app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')

db.init_app(app)
Migrate(app, db) # db init, db migrate, db upgrade, db downgrade
cors = CORS(app, resources={r"/pacientes/*": {"origins": "http://localhost:5173"}})


@app.route('/')
def main():
    return jsonify({ "status": "Server Up"}), 200

@app.route('/test', methods=['GET'])
def testing():
    return jsonify({ "msg": "hola desde el backend"}), 200

@app.route('/members')   ### DATABASE CONNECTION INDICATOR DEBUG 
@cross_origin()
def members():
    return jsonify({"members": ["Member1", "Member2", "Member3"]})

############################### Rutas para obtener diferentes conjuntos de datos de pacientes ############################

@app.route('/pacientes')
@cross_origin()
def get_all_pacientes():
    pacientes_ninnos = PacienteNino.query.filter(PacienteNino.edad < 16).all()
    pacientes_jovenes = PacienteJoven.query.filter(PacienteJoven.edad.between(16, 40)).all()
    pacientes_ancianos = PacienteAnciano.query.filter(PacienteAnciano.edad >= 41).all()

    todos_los_pacientes = pacientes_ninnos + pacientes_jovenes + pacientes_ancianos

    return jsonify([paciente.serialize() for paciente in todos_los_pacientes])


@app.route('/pacientes/ninnos')
@cross_origin()
def get_pacientes_ninos():
    pacientes_ninnos = PacienteNino.query.filter(PacienteNino.edad < 16).all()   # (1 - 15 edad ninnos)
    return jsonify([paciente.serialize() for paciente in pacientes_ninnos])



@app.route('/pacientes/ninnos/<int:id_paciente>', methods=['GET'])
@cross_origin()
def obtener_info_paciente_nino(id_paciente):
    paciente_ninno = PacienteNino.query.get(id_paciente)

    if paciente_ninno:
        return jsonify(paciente_ninno.serialize()), 200
    else:
        return jsonify({"mensaje": f"No se encontró paciente con ID {id_paciente}"}), 404



@app.route('/pacientes/ninnos/<int:id_paciente>', methods=['DELETE'])
@cross_origin()
def eliminar_paciente_ninno(id_paciente):
    try:
        paciente_ninno = PacienteNino.query.get(id_paciente)

        if paciente_ninno:
            db.session.delete(paciente_ninno)
            db.session.commit()
            return jsonify({"mensaje": f"Paciente con ID {id_paciente} eliminado exitosamente"}), 200
        else:
            return jsonify({"mensaje": f"No se encontró paciente con ID {id_paciente}"}), 404
    except Exception as e:
        print(f"Error al eliminar paciente nino con ID {id_paciente}: {str(e)}")
        db.session.rollback()  # Revertir cualquier cambio si ocurre una excepción
        return jsonify({"error": "Error al eliminar paciente nino"}), 500
    

@app.route('/pacientes/ninnos/prioridad_menor_4', methods=['GET'])
@cross_origin()
def get_ninnos_prioridad_menor_4():
    try:
        # Obtén los pacientes ninnos con prioridad menor a 4
        ninnos_prioridad_menor_4 = PacienteNino.query.filter(PacienteNino.prioridad < 4).all()

        # Verifica si hay pacientes ninnos con prioridad menor a 4
        if ninnos_prioridad_menor_4:
            # Elimina los pacientes ninnos de la lista de pendientes
            for ninno in ninnos_prioridad_menor_4:
                db.session.delete(ninno)
                db.session.commit()

            # Serializa los datos de los pacientes ninnos para la respuesta JSON
            serialized_data = [ninno.serialize() for ninno in ninnos_prioridad_menor_4]

            return jsonify(serialized_data), 200
        else:
            return jsonify({"mensaje": "No hay pacientes ninnos con prioridad menor a 4"}), 404

    except Exception as e:
        print(f"Error al obtener pacientes ninnos con prioridad menor a 4: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Error al obtener pacientes ninnos"}), 500
    

    

@app.route('/pacientes/jovenes')
@cross_origin()
def get_pacientes_jovenes():
    pacientes_jovenes = Paciente.query.filter(Paciente.edad.between(16, 40)).all() # (16 - 40 edad jovenes)
    return jsonify([paciente.serialize() for paciente in pacientes_jovenes])

@app.route('/pacientes/ancianos')
@cross_origin()
def get_pacientes_ancianos():
    pacientes_ancianos = Paciente.query.filter(Paciente.edad >= 41).all() # ( 41+ edad ancianos)
    return jsonify([paciente.serialize() for paciente in pacientes_ancianos])

@app.route('/pacientes/pendientes')
@cross_origin()
def get_pacientes_pendientes():
    # Obtén todos los pacientes
    pacientes_ninnos = PacienteNino.query.filter(PacienteNino.edad < 16).all()
    pacientes_jovenes = PacienteJoven.query.filter(PacienteJoven.edad.between(16, 40)).all()
    pacientes_ancianos = PacienteAnciano.query.filter(PacienteAnciano.edad >= 41).all()

    todos_los_pacientes = pacientes_ninnos + pacientes_jovenes + pacientes_ancianos

    # Ordena la lista de pacientes por ID de manera ascendente (orden de ingreso)
    pacientes_ordenados = sorted(todos_los_pacientes, key=lambda x: x.id, reverse=False)

    # Serializa y devuelve la lista ordenada
    return jsonify([paciente.serialize() for paciente in pacientes_ordenados])

@app.route('/pacientes/riesgo')
@cross_origin()
def get_pacientes_riesgo():
    # Obtén todos los pacientes
    pacientes_ninnos = PacienteNino.query.filter(PacienteNino.edad < 16).all()
    pacientes_jovenes = PacienteJoven.query.filter(PacienteJoven.edad.between(16, 40)).all()
    pacientes_ancianos = PacienteAnciano.query.filter(PacienteAnciano.edad >= 41).all()

    todos_los_pacientes = pacientes_ninnos + pacientes_jovenes + pacientes_ancianos

    # Ordena la lista de pacientes por riesgo de manera descendente
    pacientes_riesgo = sorted(todos_los_pacientes, key=lambda x: x.riesgo, reverse=True)

    # Serializa y devuelve la lista ordenada
    return jsonify([paciente.serialize() for paciente in pacientes_riesgo])

@app.route('/pacientes/fumadores')
def get_pacientes_fumadores():
    # Obtén todos los pacientes
    pacientes_jovenes = PacienteJoven.query.filter(PacienteJoven.edad.between(16, 40)).all()

    # Filtra los pacientes fumadores con prioridad mayor a 4
    pacientes_fumadores_urgencia = [paciente for paciente in pacientes_jovenes if paciente.fumador == 'si']

    # Serializa y devuelve la lista
    return jsonify([paciente.serialize() for paciente in pacientes_fumadores_urgencia])

@app.route('/pacientes/mas_ancianos')
def get_pacientes_mas_ancianos():
    # Obtén todos los pacientes
    pacientes_ninnos = PacienteNino.query.filter(PacienteNino.edad < 16).all()
    pacientes_jovenes = PacienteJoven.query.filter(PacienteJoven.edad.between(16, 40)).all()
    pacientes_ancianos = PacienteAnciano.query.filter(PacienteAnciano.edad >= 41).all()

    todos_los_pacientes = pacientes_ninnos + pacientes_jovenes + pacientes_ancianos

    # Ordena la lista de pacientes por mas anciano de manera descendente
    pacientes_mas_ancianos = sorted(todos_los_pacientes, key=lambda x: x.edad, reverse=True)
    # Serializa y devuelve la lista ordenada
    return jsonify([paciente.serialize() for paciente in pacientes_mas_ancianos])


# Ruta para guardar un nuevo paciente
@app.route('/pacientes/guardar', methods=['POST'])
@cross_origin()
def guardar_paciente():
    data = request.json
    edad = data.get('edad')

    if edad is None:
        return jsonify({"error": "Campo edad faltante"}), 400

    # Determinar el tipo de paciente basado en la edad
    tipo_paciente = 'paciente_nino' if int(edad) < 16 else ('paciente_joven' if int(edad) < 41 else 'paciente_anciano')


    if tipo_paciente == 'paciente_nino':
        if 'relacionPesoEstatura' not in data:
            return jsonify({"error": "Campo relacionPesoEstatura faltante"}), 400

        nuevo_paciente = PacienteNino(
            nombre=data['nombre'],
            edad=data['edad'],
            relacion_peso_estatura=data['relacionPesoEstatura'],
            no_historia_clinica=data['noHistoriaClinica'],
            prioridad=data['prioridad'],
            riesgo=data['riesgo']
        )
    elif tipo_paciente == 'paciente_joven':
        if 'fumador' not in data:
            return jsonify({"error": "Campo fumador faltante"}), 400

        nuevo_paciente = PacienteJoven(
            nombre=data['nombre'],
            edad=data['edad'],
            fumador=data['fumador'],
            no_historia_clinica=data['noHistoriaClinica'],
            prioridad=data['prioridad'],
            riesgo=data['riesgo']
        )
    elif tipo_paciente == 'paciente_anciano':
        if 'tieneDieta' not in data:
            return jsonify({"error": "Campo tieneDieta faltante"}), 400

        nuevo_paciente = PacienteAnciano(
            nombre=data['nombre'],
            edad=data['edad'],
            tiene_dieta=data['tieneDieta'],
            no_historia_clinica=data['noHistoriaClinica'],
            prioridad=data['prioridad'],
            riesgo=data['riesgo']
        )
    else:
        return jsonify({"error": "Tipo de paciente no válido"}), 400

    db.session.add(nuevo_paciente)
    db.session.commit()

    return jsonify({"message": "Paciente guardado exitosamente"}), 201



################################# Rutas relacionadas con hospitales ###############################


@app.route('/hospitales')
@cross_origin()
def get_hospitales():
    hospitales = Hospital.query.order_by(Hospital.id_hospital.asc()).all()
    return jsonify([hospital.serialize() for hospital in hospitales])

@app.route('/hospitales/<int:id_hospital>')
def get_hospital_by_id(id_hospital):
    hospital = Hospital.query.get(id_hospital)
    if hospital:
        return jsonify(hospital.serialize())
    else:
        return jsonify({"mensaje": "Hospital no encontrado"}), 404

@app.route('/hospitales/guardar', methods=['POST'])
@cross_origin()
def guardar_hospital():
    data = request.json
    nuevo_hospital = Hospital(**data)
    db.session.add(nuevo_hospital)
    db.session.commit()
    return jsonify({"mensaje": "Hospital guardado exitosamente"}), 201
    


#################################### Rutas rtelacionadas a las consultas ###########################################
    
@app.route('/consultas/guardar', methods=['POST'])
@cross_origin()
def guardar_consulta():
    data = request.json
    nueva_consulta = Consulta(**data)
    db.session.add(nueva_consulta)
    db.session.commit()
    return jsonify({"mensaje": "Consulta guardada exitosamente"}), 201

@app.route('/consultas')
@cross_origin()
def get_consultas():
    try:
        consultas = Consulta.query.all()
        consultas_serialized = [consulta.serialize() for consulta in consultas]
        return jsonify(consultas_serialized)
    except LookupError as e:
        print(f"Error al cargar consultas: {str(e)}")
        return jsonify({"error": "Error al cargar consultas"}), 500
    
@app.route('/consultas/<int:id_consulta>')
@cross_origin()
def get_consulta_by_id(id_consulta):
    try:
        consulta = Consulta.query.get(id_consulta)

        if consulta:
            consulta_serialized = consulta.serialize()
            return jsonify(consulta_serialized)
        else:
            return jsonify({"mensaje": f"No se encontró consulta con ID {id_consulta}"}), 404
    except Exception as e:
        print(f"Error al cargar consulta: {str(e)}")
        return jsonify({"error": "Error al cargar consulta"}), 500
    
@app.route('/consultas/<int:id_consulta>/actualizarEstado', methods=['PUT'])
@cross_origin()
def actualizar_estado_consulta(id_consulta):
    try:
        consulta = Consulta.query.get(id_consulta)

        if consulta:
            # Actualizar el estado de la consulta
            nuevo_estado = request.json.get('nuevoEstado')
            nueva_cantidad_pacientes = request.json.get('nuevaCantidadPacientes', consulta.cant_pacientes)
            
            # Actualizar la cantidad de pacientes atendidos
            consulta.estado = nuevo_estado
            consulta.cant_pacientes = nueva_cantidad_pacientes
            
            db.session.commit()

            return jsonify({"mensaje": f"Consulta con ID {id_consulta} actualizada exitosamente"}), 200
        else:
            return jsonify({"mensaje": f"No se encontró consulta con ID {id_consulta}"}), 404
    except Exception as e:
        print(f"Error al actualizar consulta: {str(e)}")
        return jsonify({"error": "Error al actualizar consulta"}), 500

    

@app.route('/consultas/liberar_todas', methods=['PUT'])
@cross_origin()
def liberar_todas_consultas():
    try:
        # Lógica para liberar todas las consultas ocupadas en la base de datos
        # Esto podría implicar una actualización en la base de datos para establecer el estado como 'en espera'
        # Después de la actualización, obtén y devuelve la lista actualizada de consultas
        consultas = Consulta.query.all()
        for consulta in consultas:
            if consulta.estado == 'ocupada':
                consulta.estado = 'en espera'
        db.session.commit()
        consultas_serialized = [consulta.serialize() for consulta in consultas]
        return jsonify(consultas_serialized)
    except Exception as e:
        print(f"Error al liberar consultas: {str(e)}")
        return jsonify({"error": "Error al liberar consultas"}), 500





if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000)

