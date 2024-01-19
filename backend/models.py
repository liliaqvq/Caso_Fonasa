from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum

db = SQLAlchemy()

class Paciente(db.Model):
    __tablename__ = 'paciente'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    no_historia_clinica = db.Column(db.Integer, nullable=False)
    prioridad = db.Column(db.Float, nullable=False)  # Add this field
    riesgo = db.Column(db.Float, nullable=False)  # Add this field
    tipo_paciente = db.Column(db.String(20), nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'paciente',
        'polymorphic_on': tipo_paciente 
    }


    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'edad': self.edad,
            'no_historia_clinica': self.no_historia_clinica,
            'prioridad': self.prioridad,
            'riesgo': self.riesgo,
            'tipo_paciente': self.tipo_paciente
        }

class PacienteAnciano(Paciente):
    __tablename__ = 'paciente_anciano'
    id = db.Column(db.Integer, db.ForeignKey('paciente.id'), primary_key=True)
    tiene_dieta = db.Column(db.String(3), nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'paciente_anciano',
    }

    def serialize(self):
        data = super().serialize()
        data['tiene_dieta'] = self.tiene_dieta
        return data

class PacienteJoven(Paciente):
    __tablename__ = 'paciente_joven'
    id = db.Column(db.Integer, db.ForeignKey('paciente.id'), primary_key=True)
    fumador = db.Column(db.String(3), nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'paciente_joven',
    }

    def serialize(self):
        data = super().serialize()
        data['fumador'] = self.fumador
        return data
    
class PacienteNino(Paciente):
    __tablename__ = 'paciente_nino'
    id = db.Column(db.Integer, db.ForeignKey('paciente.id'), primary_key=True)
    relacion_peso_estatura = db.Column(db.Integer, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'paciente_nino',
    }

    def serialize(self):
        data = super().serialize()
        data['relacion_peso_estatura'] = self.relacion_peso_estatura
        return data
    

class Hospital(db.Model):
    __tablename__ = 'hospital'
    id_hospital = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)

    def serialize(self):
        return {
            'id_hospital': self.id_hospital,
            'nombre': self.nombre
        }
    

class Consulta(db.Model):
    __tablename__ = 'consulta'
    id_consulta = db.Column(db.Integer, primary_key=True)
    id_hospital = db.Column(db.Integer, db.ForeignKey('hospital.id_hospital'))
    cant_pacientes = db.Column(db.Integer, nullable=False)
    nombre_especialista = db.Column(db.String(50), nullable=False)
    tipo_consulta = db.Column(db.String(50), nullable=False)
    estado = db.Column(db.String(50), nullable=False)

    def serialize(self):
        return {
            'id_consulta': self.id_consulta,
            'id_hospital': self.id_hospital,
            'cant_pacientes': self.cant_pacientes,
            'nombre_especialista': self.nombre_especialista,
            'tipo_consulta': self.tipo_consulta,
            'estado': self.estado
        }
