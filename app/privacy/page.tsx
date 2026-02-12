import Link from "next/link";
import { Header } from "@/components/header";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-stone-900">
            Política de Privacidad y Tratamiento de Datos
          </h1>
        </div>

        <div className="space-y-6 text-stone-700 text-sm leading-relaxed">
          <Section title="1. Responsable del tratamiento">
            <p>
              MBC Marketplace es responsable del tratamiento de
              los datos personales recolectados a través de esta
              plataforma, conforme a la Ley 1581 de 2012 y el
              Decreto 1377 de 2013 de Colombia.
            </p>
          </Section>

          <Section title="2. Datos que recolectamos">
            <p>
              Al realizar una solicitud de compra, recolectamos:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nombre completo</li>
              <li>Número de celular</li>
              <li>Dirección de entrega</li>
              <li>Barrio</li>
              <li>Medio de pago seleccionado</li>
              <li>Productos solicitados y cantidades</li>
            </ul>
          </Section>

          <Section title="3. Finalidad del tratamiento">
            <p>
              Los datos personales serán utilizados
              exclusivamente para:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Gestionar y procesar tu pedido</li>
              <li>
                Coordinar la entrega de los productos a tu
                dirección
              </li>
              <li>
                Contactarte por celular sobre el estado de tu
                pedido
              </li>
              <li>
                Mantener un historial de compras para mejorar
                el servicio
              </li>
            </ul>
            <p className="mt-2">
              <strong>No</strong> compartiremos, venderemos ni
              cederemos tus datos a terceros sin tu
              autorización previa.
            </p>
          </Section>

          <Section title="4. Autorización">
            <p>
              Al marcar la casilla de autorización en el
              formulario de compra, declaras que has leído y
              aceptas esta política y autorizas el tratamiento
              de tus datos para las finalidades descritas.
            </p>
          </Section>

          <Section title="5. Derechos del titular">
            <p>
              Como titular de los datos, tienes derecho a:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Conocer</strong> los datos personales
                que tenemos almacenados sobre ti
              </li>
              <li>
                <strong>Actualizar y rectificar</strong> tus
                datos si son incorrectos o están
                desactualizados
              </li>
              <li>
                <strong>Solicitar la eliminación</strong> de tus
                datos cuando no sean necesarios para la
                finalidad autorizada
              </li>
              <li>
                <strong>Revocar</strong> la autorización para el
                tratamiento de tus datos
              </li>
            </ul>
            <p className="mt-2">
              Para ejercer estos derechos, visita la sección{" "}
              <Link
                href="/my-data"
                className="text-red-600 underline font-medium"
              >
                Mis Datos
              </Link>
              .
            </p>
          </Section>

          <Section title="6. Seguridad de la información">
            <p>
              Implementamos medidas técnicas y organizativas
              para proteger tus datos contra acceso no
              autorizado, pérdida, alteración o divulgación
              indebida, incluyendo:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Base de datos con acceso restringido y
                autenticado
              </li>
              <li>
                Conexión cifrada (HTTPS) en toda la plataforma
              </li>
              <li>
                Variables de entorno seguras para credenciales
              </li>
            </ul>
          </Section>

          <Section title="7. Vigencia">
            <p>
              Los datos se conservarán mientras exista una
              relación comercial o hasta que el titular solicite
              su eliminación.
            </p>
          </Section>

          <Section title="8. Contacto">
            <p>
              Para consultas sobre el tratamiento de datos,
              puedes contactarnos a través de los canales
              disponibles en la plataforma.
            </p>
          </Section>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <Link
            href="/"
            className="text-sm text-stone-500 hover:text-stone-800 underline"
          >
            &larr; Volver al catálogo
          </Link>
        </div>
      </main>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-bold text-stone-900 mb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}
