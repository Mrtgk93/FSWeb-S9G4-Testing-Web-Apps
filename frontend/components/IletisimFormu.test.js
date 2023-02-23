import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
  expect(screen.getByText("İletişim Formu")).toBeInTheDocument();
  expect(screen.getByLabelText("Ad*")).toBeInTheDocument();
  expect(screen.getByLabelText("Soyad*")).toBeInTheDocument();
  expect(screen.getByLabelText("Email*")).toBeInTheDocument();
  expect(screen.getByLabelText("Mesaj")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Gönder" })).toBeInTheDocument();
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  expect(screen.getByText("İletişim Formu")).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "A");
  expect(await screen.findByTestId("error")).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findAllByTestId("error")).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Ahmet");
  userEvent.type(screen.getByPlaceholderText("Mansız"), "Developer");
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findAllByTestId("error")).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Ahmet");
  userEvent.type(screen.getByPlaceholderText("Mansız"), "Developer");
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "ali.com"
  );
  expect(await screen.findByTestId("error")).toHaveTextContent(
    "email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Ahmet");
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "ali@ali.com"
  );
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("error")).toHaveTextContent(
    "soyad gereklidir."
  );
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Ahmet");
  userEvent.type(screen.getByPlaceholderText("Mansız"), "Developer");
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "ali@ali.com"
  );

  expect(screen.queryAllByTestId("error")).toHaveLength(0);
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Ahmet");
  userEvent.type(screen.getByPlaceholderText("Mansız"), "Developer");
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "ali@ali.com"
  );
  userEvent.type(screen.getByText("Mesaj"), "aga beee ödevi nasıl yaptum ama");
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("firstnameDisplay")).toHaveTextContent(
    "Ahmet"
  );
  expect(await screen.findByTestId("lastnameDisplay")).toHaveTextContent(
    "Developer"
  );
  expect(await screen.findByTestId("emailDisplay")).toHaveTextContent(
    "ali@ali.com"
  );
  expect(await screen.findByTestId("messageDisplay")).toHaveTextContent(
    "aga beee ödevi nasıl yaptum ama"
  );
});
