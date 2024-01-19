"""empty message

Revision ID: fa1a880cf665
Revises: d57db92e3a1f
Create Date: 2024-01-18 18:00:02.559748

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'fa1a880cf665'
down_revision = 'd57db92e3a1f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('consulta', schema=None) as batch_op:
        batch_op.alter_column('tipo_consulta',
               existing_type=mysql.ENUM('PEDIATRIA', 'URGENCIA', 'CGI'),
               type_=sa.Enum('PEDAITRIA', 'URGENCIA', 'CGI'),
               existing_nullable=False)
        batch_op.alter_column('estado',
               existing_type=mysql.ENUM('ocupado', 'en espera'),
               type_=sa.Enum('OCUPADO', 'EN_ESPERA'),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('consulta', schema=None) as batch_op:
        batch_op.alter_column('estado',
               existing_type=sa.Enum('OCUPADO', 'EN_ESPERA'),
               type_=mysql.ENUM('ocupado', 'en espera'),
               existing_nullable=False)
        batch_op.alter_column('tipo_consulta',
               existing_type=sa.Enum('PEDAITRIA', 'URGENCIA', 'CGI'),
               type_=mysql.ENUM('PEDIATRIA', 'URGENCIA', 'CGI'),
               existing_nullable=False)

    # ### end Alembic commands ###